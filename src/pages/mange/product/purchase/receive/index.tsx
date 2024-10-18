import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconChevronDown, IconPhoto } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Popover, Typography } from 'antd'
import cloneDeep from 'lodash/cloneDeep'

import { FileType } from '@/api/file/add-file-record'
import { useVariantsByIds, VariantsByIdsRes } from '@/api/product/variants-by-ids'
import { PurchaseAdjustReceiveApi, PurchaseAdjustReceiveItem } from '@/api/purchase/adjust'
import { PurchaseItem } from '@/api/purchase/base'
import { PurchaseInfoApi } from '@/api/purchase/info'
import FileImage from '@/components/file-image'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SInputNumber from '@/components/s-input-number'
import { sMessage } from '@/components/s-message'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import { useI18n } from '@/hooks/use-lang'
import Detail from '@/pages/mange/product/purchase/change/detail'
import Progress from '@/pages/mange/product/purchase/change/progress'
import { reduce, sum } from '@/utils'
import { isEqualHandle } from '@/utils/is-equal-handle'
import { renderText } from '@/utils/render-text'

import styles from './index.module.less'

export default function Receive () {
  const t = useI18n()
  const { id } = useParams()
  const info = useRequest(PurchaseInfoApi, { manual: true })
  const { run, data } = useVariantsByIds()
  const [list, setList] = useState<PurchaseItem[]>([])
  const [isChange, setIsChange] = useState(false)
  const init = useRef<any>()
  const adjust = useRequest(PurchaseAdjustReceiveApi, { manual: true })
  const nav = useNavigate()

  const total = useMemo(() => {
    return {
      purchasing: sum(...list.map(i => i.purchasing)),
      received: sum(...list.map(i => i.received || 0)),
      rejected: sum(...list.map(i => i.rejected || 0))
    }
  }, [list])
  const canActionAll = list.some(i => {
    return reduce(i.purchasing, i.received, i.rejected) > 0
  })

  const onUpdate = (row: PurchaseItem, key: keyof PurchaseItem, v: any) => {
    // @ts-expect-error
    row[key] = v
    setList(list.map(item => item.id === row.id ? row : item))
  }

  const onAcceptAll = () => {
    const items = list?.map(item => {
      const remain = item.purchasing - (item.received || 0) - (item.rejected || 0)
      if (remain <= 0) return item
      return { ...item, received_count: remain, rejected_count: 0 }
    })
    setList(items || [])
    sMessage.success(t('已自动分配'))
  }

  const onRejectAll = () => {
    const items = list?.map(item => {
      const remain = item.purchasing - (item.received || 0) - (item.rejected || 0)
      if (remain <= 0) return item
      return { ...item, rejected_count: remain, received_count: 0 }
    })
    setList(items || [])
    sMessage.success(t('已自动分配'))
  }

  const onReset = () => {
    setList(cloneDeep(init.current))
    setIsChange(false)
  }

  const onOk = async () => {
    if (!list?.length || !id) return
    const items: PurchaseAdjustReceiveItem[] = list.map(item => {
      return { id: item.id, received_count: item.received_count || 0, rejected_count: item.rejected_count || 0 }
    }).filter(i => i.received_count || i.rejected_count)
    await adjust.runAsync({ items, id: Number(id) })
    sMessage.success(t('库存接收成功'))
    nav(`/products/purchase_orders/info/${id}`)
  }

  const columns: STableProps['columns'] = [
    {
      title: t('商品'),
      code: 'id',
      name: 'id',
      render: (_, row: VariantsByIdsRes) => (
        <Flex align={'center'} gap={16}>
          <SRender render={row.image}>
            <FileImage size={16} width={32} height={32} src={row.image} type={FileType.Image} />
          </SRender>
          <SRender render={!row.image}>
            <Flex align={'center'} justify={'center'} style={{ width: 34, height: 34, background: '#f5f5f5', border: '1px solid #eee', borderRadius: 8 }}>
              <IconPhoto color={'#ddd'} />
            </Flex>
          </SRender>
          <div>
            <div>{row.product_title}</div>
            <div className={'secondary'}>{row.name}</div>
          </div>
        </Flex>
      ),
      width: 250
    },
    {
      title: t('供应商SKU'),
      code: 'sku',
      name: 'sku',
      render: (sku: string, row: PurchaseItem) => (
        <Typography.Text>{renderText(sku)}</Typography.Text>
      ),
      width: 150
    },
    {
      title: t('收货'),
      code: 'received_count',
      width: 150,
      name: 'received_count',
      render: (received_count: number, row: PurchaseItem) => (
        <Flex gap={4} align={'center'}>
          <SInputNumber required value={received_count || 0} onChange={v => { onUpdate(row, 'received_count', v) }} uint />
          <Button
            disabled={reduce(row.purchasing, row.received, row.rejected) <= 0}
            onClick={() => {
              const remain = reduce(row.purchasing, row.received, row.rejected)
              if (remain >= 0) {
                onUpdate(row, 'received_count', remain)
                onUpdate(row, 'rejected_count', 0)
              }
            }}
            style={{ marginRight: 12 }}
            type={'link'}
            size={'small'}
          >
            全部
          </Button>
        </Flex>
      )
    },
    {
      title: t('拒收'),
      render: (rejected_count: number, row: PurchaseItem) => (
        <Flex gap={4} align={'center'}>
          <SInputNumber required value={rejected_count || 0} onChange={v => { onUpdate(row, 'rejected_count', v) }} uint />
          <Button
            disabled={reduce(row.purchasing, row.received, row.rejected) <= 0}
            onClick={() => {
              const remain = reduce(row.purchasing, row.received, row.rejected)
              if (remain >= 0) {
                onUpdate(row, 'rejected_count', remain)
                onUpdate(row, 'received_count', 0)
              }
            }}
            style={{ marginRight: 12 }}
            type={'link'}
            size={'small'}
          >
            全部
          </Button>
        </Flex>
      ),
      width: 150,
      name: 'rejected_count',
      code: 'rejected_count'
    },
    {
      title: t('收货数量'),
      width: 150,
      name: 'id',
      code: 'id',
      render: (_, row: PurchaseItem) => (
        <Flex vertical gap={8} style={{ marginTop: 4 }}>
          <Progress
            purchasing={row.purchasing}
            received={sum(row.received, row.received_count)}
            rejected={sum(row.rejected, row.rejected_count)}
          />
          <Popover
            arrow={false}
            placement={'bottomLeft'}
            trigger={'click'}
            content={
              <Detail
                received={sum(row.received, row.received_count)}
                purchasing={row.purchasing}
                rejected={sum(row.rejected, row.rejected_count)}
                vertical
              />
            }
            overlayInnerStyle={{ padding: '16px 8px' }}
          >
            <Flex align={'center'} className={styles.more}>
              {sum(row.rejected_count, row.received, row.rejected, row.received_count)} / {row.purchasing}
              <IconChevronDown style={{ marginLeft: 4, marginTop: -1 }} size={13} />
            </Flex>
          </Popover>
        </Flex>
      )
    }
  ]

  useEffect(() => {
    if (!id) return
    info.runAsync({ id: Number(id) })
  }, [id])

  useEffect(() => {
    const items = info?.data?.purchase_items?.map(item => {
      const find = data.find(i => i.id === item.variant_id)
      if (!find) return item
      const { id, ...rest } = find
      return { ...item, ...rest }
    })
    setList(items || [])
  }, [info.data, data])

  useEffect(() => {
    if (!info.data?.purchase_items) return
    run({ ids: info.data.purchase_items.map(item => item.variant_id) })
  }, [info?.data])

  useEffect(() => {
    if (!list?.length) return
    if (!init.current?.length || init.current?.some((item: any) => item.image === undefined)) {
      init.current = cloneDeep(list)
    }
    const isSame = isEqualHandle(list, init.current)
    setIsChange(!isSame)
  }, [list])

  return (
    <Page
      onOk={onOk}
      onCancel={onReset}
      isChange={isChange}
      loading={info.loading || (!!id && !info?.data?.status) || !list?.every(i => (i as any)?.image !== undefined)}
      back={`/products/purchase_orders/info/${id}`}
      width={950}
      title={
        <Flex gap={8} align={'center'}>
          <div>{t('接收库存')}</div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{info?.data?.order_number}</div>
        </Flex>
      }
      bottom={64}
      type={'product'}
    >
      <div style={{ minHeight: 400 }}>
        <SCard
          extra={
            <SRender render={canActionAll}>
              <Flex gap={4}>
                <Button type={'link'} size={'small'} onClick={onAcceptAll}>接收全部</Button>
                <Button type={'link'} size={'small'} onClick={onRejectAll}>拒绝全部</Button>
              </Flex>
            </SRender>
          }
          title={'Products'}
        >
          <SRender render={list.length >= 2 && (total.received || total.rejected)} style={{ padding: '8px 0 16px 4px' }}>
            <Flex>
              <div>
                <Progress purchasing={total.purchasing} received={total.received} rejected={total.rejected} />
                <div style={{ marginBottom: 8 }} />
                <Detail purchasing={total.purchasing} received={total.received} rejected={total.rejected} />
              </div>
            </Flex>
          </SRender>
          <STable
            className={'table-border'}
            borderless
            init
            columns={columns}
            data={list || []}
          />
        </SCard>
      </div>
    </Page>
  )
}
