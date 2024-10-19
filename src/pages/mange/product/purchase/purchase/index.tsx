import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Button, Flex, Typography } from 'antd'
import dayjs from 'dayjs'

import { LocationListApi } from '@/api/location/list'
import { SupplierListApi } from '@/api/product/supplier-list'
import { PurchaseListApi, PurchaseListReq } from '@/api/purchase/list'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import STable, { STableProps } from '@/components/s-table'
import { getPurchaseStatus } from '@/constant/purchase'
import { useI18n } from '@/hooks/use-lang'
import Filters from '@/pages/mange/product/purchase/purchase/filters'
import { formatPrice } from '@/utils/num'
import { renderText } from '@/utils/render-text'

export default function Purchase () {
  const nav = useNavigate()
  const [params, setParams] = useState<PurchaseListReq>({ page_size: 20, page: 1 })
  const list = useRequest(PurchaseListApi, { manual: true })
  const locations = useRequest(async () => await LocationListApi({ active: true }))
  const supplierList = useRequest(SupplierListApi)
  const [selected, setSelected] = useState<number[]>([])
  const t = useI18n()

  const columns: STableProps['columns'] = [
    {
      title: 'Purchase order',
      code: 'order_number',
      name: 'order_number',
      render: (order_number: string) => <div>{order_number}</div>,
      width: 120,
      lock: true
    },
    {
      title: 'Supplier',
      code: 'supplier_id',
      name: 'supplier_id',
      render: (supplier_id: number) => {
        return <Typography.Text>{supplierList?.data?.find(i => i.id === supplier_id)?.address?.legal_business_name}</Typography.Text>
      },
      width: 200
    },
    {
      title: 'Destination',
      code: 'destination_id',
      name: 'destination_id',
      render: (destination_id: number) => {
        return <Typography.Text>{locations?.data?.find(i => i.id === destination_id)?.name}</Typography.Text>
      },
      width: 200
    },
    {
      title: 'Status',
      code: 'status',
      name: 'status',
      render: (status: number) => {
        return (<div style={{ display: 'inline-block' }}>{getPurchaseStatus(t, status, true)}</div>)
      },
      width: 120
    },
    {
      title: '采购数',
      code: 'purchasing',
      name: 'purchasing',
      render: (purchasing: number) => <div>{purchasing} 件</div>,
      width: 80
    },
    {
      title: '已入库',
      code: 'received',
      name: 'received',
      render: (received: number) => <div>{received} 件</div>,
      width: 80
    },
    {
      title: '已拒收',
      code: 'rejected',
      name: 'rejected',
      render: (rejected: number) => <div>{rejected} 件</div>,
      width: 80
    },
    {
      title: 'Total',
      code: 'total',
      name: 'total',
      render: (total: number) => <div>{formatPrice(total, '$')}</div>,
      width: 120
    },
    {
      title: 'Expected arrival',
      code: 'estimated_arrival',
      name: 'estimated_arrival',
      render: (expected_arrival: number) => {
        return <div>{expected_arrival ? dayjs(expected_arrival * 1000).format('YYYY-MM-DD') : renderText()}</div>
      },
      width: 150
    }
  ]

  useEffect(() => {
    list.run(params)
  }, [params])

  return (
    <Page
      bottom={64}
      header={
        <Button onClick={() => { nav('change') }} type={'primary'}>
          {t('创建采购单')}
        </Button>
      }
      type={'product'}
      title={'Purchase'}
    >
      <SCard styles={{ body: { padding: '8px 0' } }}>
        <Filters />
        <STable
          init={!!list.data && !!locations.data && !!supplierList.data}
          columns={columns}
          loading={list.loading}
          data={list.data?.list || []}
          rowSelection={{ value: selected, onChange: setSelected }}
          empty={{
            title: 'Manage your purchase orders',
            desc: 'Track and receive inventory ordered from suppliers.',
            actions: (
              <Flex gap={8}>
                <Button onClick={() => { nav('change') }} type={'primary'}>
                  创建采购单
                </Button>
              </Flex>
            )
          }}
          onRowClick={row => {
            nav(`/products/purchase_orders${[2, 3, 4, 5].includes(row.status) ? '/info' : '/change'}/${row.id}`)
          }}
          page={{
            current: params.page,
            pageSize: params.page_size,
            total: list?.data?.total,
            onChange: (page, page_size) => {
              setParams({ ...params, page, page_size })
            }
          }}
        />
      </SCard>
    </Page>
  )
}
