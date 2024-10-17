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
import { renderText } from '@/utils/render-text'

export default function Purchase () {
  const nav = useNavigate()
  const [params, setParams] = useState<PurchaseListReq>({ page_size: 20, page: 1 })
  const list = useRequest(PurchaseListApi, { manual: true })
  const locations = useRequest(async () => await LocationListApi({ active: true }))
  const supplierList = useRequest(SupplierListApi)
  const [selected, setSelected] = useState<number[]>([])

  const columns: STableProps['columns'] = [
    {
      title: 'Purchase order number',
      code: 'order_number',
      name: 'order_number',
      render: (order_number: string) => <div>{order_number}</div>,
      width: 180,
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
      render: (status: number) => <div>{status}</div>,
      width: 120
    },
    {
      title: 'Received',
      code: 'received_quantity',
      name: 'received_quantity',
      render: (received_quantity: number) => <div>{received_quantity}</div>,
      width: 120
    },
    {
      title: 'Total',
      code: 'total',
      name: 'total',
      render: (total: number) => <div>{total}</div>,
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
          Create purchase order
        </Button>
      }
      type={'product'}
      title={'Purchase'}
    >
      <SCard styles={{ body: { padding: '8px 0' } }}>
        <STable
          init={!!list.data && !!locations.data && !!supplierList.data}
          columns={columns}
          loading={list.loading}
          data={list.data?.list || []}
          rowSelection={{ value: selected, onChange: setSelected, width: 32 }}
          empty={{
            title: 'Manage your purchase orders',
            desc: 'Track and receive inventory ordered from suppliers.',
            actions: (
              <Flex gap={8}>
                <Button onClick={() => { nav('change') }} type={'primary'}>
                  Create purchase order
                </Button>
              </Flex>
            )
          }}
          onRowClick={row => { nav(`/products/purchase_orders/change/${row.id}`) }}
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
