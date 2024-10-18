import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { IconPhoto } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex } from 'antd'

import { FileType } from '@/api/file/add-file-record'
import { useVariantsByIds, VariantsByIdsRes } from '@/api/product/variants-by-ids'
import { PurchaseInfoApi } from '@/api/purchase/info'
import FileImage from '@/components/file-image'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import { useI18n } from '@/hooks/use-lang'

export default function Receive () {
  const t = useI18n()
  const { id } = useParams()
  const info = useRequest(PurchaseInfoApi, { manual: true })
  const { run, loading, data } = useVariantsByIds()

  const list = useMemo(() => {
    return info?.data?.purchase_items?.map(item => {
      const find = data.find(i => i.id === item.variant_id)
      if (!find) return item
      const { id, ...rest } = find
      return { ...item, ...rest }
    })
  }, [info.data, data]) || []

  console.log(list)

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

    { title: t('供应商SKU') },
    { title: t('收货') },
    { title: t('拒绝') },
    { title: t('收货数量') }
  ]

  useEffect(() => {
    if (!id) return
    info.runAsync({ id: Number(id) })
  }, [id])

  useEffect(() => {
    if (!info.data?.purchase_items) return
    run({ ids: info.data.purchase_items.map(item => item.variant_id) })
  }, [info?.data])

  return (
    <Page
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
          loading={!list?.every(i => (i as any)?.image !== undefined) || info.loading}
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
            init
            columns={columns}
            data={list || []}
          />
        </SCard>
      </div>
    </Page>
  )
}
