import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IconPhoto } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Typography } from 'antd'

import { FileType } from '@/api/file/add-file-record'
import { useVariantsByIds, VariantsByIdsRes } from '@/api/product/variants-by-ids'
import { PurchaseItem } from '@/api/purchase/base'
import { PurchaseInfoApi } from '@/api/purchase/info'
import FileImage from '@/components/file-image'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import { useI18n } from '@/hooks/use-lang'
import Progress from '@/pages/mange/product/purchase/change/progress'
import { renderText } from '@/utils/render-text'

export default function Receive () {
  const t = useI18n()
  const { id } = useParams()
  const info = useRequest(PurchaseInfoApi, { manual: true })
  const { run, data } = useVariantsByIds()
  const [list, setList] = useState<PurchaseItem[]>([])

  const onUpdate = (row: PurchaseItem, key: keyof PurchaseItem, v: any) => {
    setList(list.map(item => item.id === row.id ? { ...item, [key]: v } : item))
  }

  const columns: STableProps['columns'] = [
    {
      title: t('Products'),
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
      title: t('Supplier SKU'),
      code: 'sku',
      name: 'sku',
      render: (sku: string, row: PurchaseItem) => (
        <Typography.Text>{renderText(sku)}</Typography.Text>
      ),
      width: 150
    },
    {
      title: t('收货'),
      code: 'received',
      width: 150,
      name: 'received',
      render: (received: number, row: PurchaseItem) => (
        <Flex gap={4} align={'center'}>
          <SInputNumber required value={received} onChange={v => { onUpdate(row, 'received', v) }} uint />
          <Button style={{ marginRight: 12 }} type={'link'} size={'small'}>All</Button>
        </Flex>
      )
    },
    {
      title: t('拒绝'),
      render: (rejected: number, row: PurchaseItem) => (
        <Flex gap={4} align={'center'}>
          <SInputNumber required value={rejected} onChange={v => { onUpdate(row, 'rejected', v) }} uint />
          <Button style={{ marginRight: 12 }} type={'link'} size={'small'}>All</Button>
        </Flex>
      ),
      width: 150,
      name: 'rejected',
      code: 'rejected'
    },
    {
      title: t('收货数量'),
      width: 150,
      name: 'id',
      code: 'id',
      render: (_, row: PurchaseItem) => (
        <Flex vertical gap={4}>
          <Progress purchasing={row.purchasing} received={row.received} rejected={row.rejected} />
          <Flex style={{ fontSize: 12 }}>
            {row.received || 0} / {row.purchasing}
          </Flex>
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

  return (
    <Page
      loading={info.loading || (!!id && !info?.data?.status)}
      back={`/products/purchase_orders/info/${id}`}
      width={950}
      title={
        <Flex gap={8} align={'center'}>
          <div>{t('Receive items')}</div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{info?.data?.order_number}</div>
        </Flex>
      }
      bottom={64}
      type={'product'}
    >
      <div style={{ minHeight: 400 }}>
        <SCard
          extra={
            <Flex gap={4}>
              <Button type={'link'} size={'small'}>接收全部</Button>
              <Button type={'link'} size={'small'}>拒绝全部</Button>
            </Flex>
          }
          title={'Products'}
        >
          <STable
            className={'table-border'}
            borderless
            init={list?.every(i => (i as any)?.image !== undefined)}
            columns={columns}
            data={list || []}
          />
        </SCard>
      </div>
    </Page>
  )
}
