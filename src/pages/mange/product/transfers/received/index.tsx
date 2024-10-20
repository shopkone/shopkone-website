import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconChevronDown, IconPhoto } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Popover, Typography } from 'antd'

import { FileType } from '@/api/file/add-file-record'
import { useVariantsByIds, VariantsByIdsRes } from '@/api/product/variants-by-ids'
import { TransferAdjustApi, TransferAdjustItem } from '@/api/transfers/adjust'
import { TransferItem } from '@/api/transfers/create'
import { TransferInfoApi } from '@/api/transfers/info'
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
import styles from '@/pages/mange/product/purchase/receive/index.module.less'
import { reduce, sum } from '@/utils'
import { renderText } from '@/utils/render-text'

export default function TransferReceived () {
  const { id } = useParams()
  const info = useRequest(TransferInfoApi, { manual: true })
  const [list, setList] = useState<TransferItem[]>([])
  const { run, data, loading } = useVariantsByIds()
  const t = useI18n()
  const adjust = useRequest(TransferAdjustApi, { manual: true })
  const nav = useNavigate()
  const canActionAll = list.some(i => {
    return reduce(i.quantity, i.received, i.rejected) > 0
  })

  const onUpdate = (row: TransferItem, key: keyof TransferItem, v: any) => {
    row[key] = v
    setList(list.map(item => item.id === row.id ? row : item))
  }

  const onAcceptAll = () => {
    const items = list?.map(item => {
      const remain = item.quantity - (item.received || 0) - (item.rejected || 0)
      if (remain <= 0) return item
      return { ...item, received_count: remain, rejected_count: 0 }
    })
    setList(items || [])
  }

  const onRejectAll = () => {
    const items = list?.map(item => {
      const remain = item.quantity - (item.received || 0) - (item.rejected || 0)
      if (remain <= 0) return item
      return { ...item, rejected_count: remain, received_count: 0 }
    })
    setList(items || [])
  }

  const onOk = async () => {
    const items: TransferAdjustItem[] = list.filter(i => i.received_count || i.rejected_count).map(i => ({
      variant_id: i.variant_id,
      received: i.received_count || 0,
      rejected: i.rejected_count || 0
    }))
    await adjust.runAsync({ items, id: Number(id) })
    sMessage.success(t('操作成功'))
    nav(`/products/transfers/info/${id}`)
  }

  const onCancel = () => {
    const newList = list.map(item => ({ ...item, received_count: 0, rejected_count: 0 }))
    setList(newList)
  }

  const isChange = list.some(i => i.received_count || i.rejected_count)

  const total = useMemo(() => {
    return {
      purchasing: sum(...list.map(i => i.quantity)),
      received: sum(sum(...list.map(i => i.received || 0)), sum(...list.map(i => i.received_count || 0))),
      rejected: sum(sum(...list.map(i => i.rejected || 0)), sum(...list.map(i => i.rejected_count || 0)))
    }
  }, [list])

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
      render: (sku: string, row: TransferItem) => (
        <Typography.Text>{renderText(sku)}</Typography.Text>
      ),
      width: 150
    },
    {
      title: t('入库'),
      code: 'received_count',
      width: 150,
      name: 'received_count',
      render: (received_count: number, row: TransferItem) => (
        <Flex gap={4} align={'center'}>
          <SInputNumber required value={received_count || 0} onChange={v => { onUpdate(row, 'received_count', v) }} uint />
          <Button
            disabled={reduce(row.quantity, row.received, row.rejected) <= 0}
            onClick={() => {
              const remain = reduce(row.quantity, row.received, row.rejected)
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
      render: (rejected_count: number, row: TransferItem) => (
        <Flex gap={4} align={'center'}>
          <SInputNumber required value={rejected_count || 0} onChange={v => { onUpdate(row, 'rejected_count', v) }} uint />
          <Button
            disabled={reduce(row.quantity, row.received, row.rejected) <= 0}
            onClick={() => {
              const remain = reduce(row.quantity, row.received, row.rejected)
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
      title: t('入库数量'),
      width: 150,
      name: 'id',
      code: 'id',
      render: (_, row: TransferItem) => (
        <Flex vertical gap={8} style={{ marginTop: 4 }}>
          <Progress
            purchasing={row.quantity}
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
                purchasing={row.quantity}
                rejected={sum(row.rejected, row.rejected_count)}
                vertical
              />
            }
            overlayInnerStyle={{ padding: '16px 8px' }}
          >
            <Flex align={'center'} className={styles.more}>
              {sum(row.rejected_count, row.received, row.rejected, row.received_count)} / {row.quantity}
              <IconChevronDown style={{ marginLeft: 4, marginTop: -1 }} size={13} />
            </Flex>
          </Popover>
        </Flex>
      )
    }
  ]

  useEffect(() => {
    if (!id) return
    info.run({ id: Number(id) })
  }, [id])

  useEffect(() => {
    if (!info.data?.items) return
    run({ ids: info.data.items.map(item => item.variant_id) })
  }, [info?.data])

  useEffect(() => {
    const items = info?.data?.items?.map(item => {
      const find = data.find(i => i.id === item.variant_id)
      if (!find) return item
      const { id, ...rest } = find
      return { ...item, ...rest }
    })
    setList(items || [])
  }, [info.data, data])

  return (
    <Page
      loadingHiddenBg
      loading={info.loading || data.length === 0}
      onOk={onOk}
      onCancel={onCancel}
      isChange={isChange}
      back={`/products/transfers/info/${id}`}
      title={(
        <Flex gap={8} align={'center'}>
          <div>{t('收货')}</div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{info?.data?.transfer_number}</div>
        </Flex>
      )}
      width={950}
      type={'product'}
    >
      <SCard
        title={'商品'}
        extra={
          <SRender render={canActionAll}>
            <Flex gap={4}>
              <Button type={'link'} size={'small'} onClick={onAcceptAll}>接收全部</Button>
              <Button type={'link'} size={'small'} onClick={onRejectAll}>拒绝全部</Button>
            </Flex>
          </SRender>
        }
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
          loading={loading}
          columns={columns}
          data={list || []}
        />
      </SCard>
    </Page>
  )
}
