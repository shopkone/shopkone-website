import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconChevronDown } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Popover, Typography } from 'antd'
import dayjs from 'dayjs'

import { LocationListApi } from '@/api/location/list'
import { SupplierListApi } from '@/api/product/supplier-list'
import { PurchaseListApi, PurchaseListReq, PurchaseListRes } from '@/api/purchase/list'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import STable, { STableProps } from '@/components/s-table'
import { getPurchaseStatus } from '@/constant/purchase'
import Detail from '@/pages/mange/product/purchase/change/detail'
import Progress from '@/pages/mange/product/purchase/change/progress'
import Filters from '@/pages/mange/product/purchase/purchase/filters'
import styles from '@/pages/mange/product/purchase/receive/index.module.less'
import { formatPrice } from '@/utils/num'
import { renderText } from '@/utils/render-text'

export default function Purchase () {
  const nav = useNavigate()
  const [params, setParams] = useState<PurchaseListReq>({ page_size: 20, page: 1 })
  const list = useRequest(PurchaseListApi, { manual: true })
  const locations = useRequest(async () => await LocationListApi({ active: true }))
  const supplierList = useRequest(SupplierListApi)
  const [selected, setSelected] = useState<number[]>([])
  const { t } = useTranslation('product', { keyPrefix: 'purchase' })

  const columns: STableProps['columns'] = [
    {
      title: t('采购单号'),
      code: 'order_number',
      name: 'order_number',
      render: (order_number: string) => <div>{order_number}</div>,
      width: 120,
      lock: true
    },
    {
      title: t('供应商1'),
      code: 'supplier_id',
      name: 'supplier_id',
      render: (supplier_id: number) => {
        return <Typography.Text>{supplierList?.data?.find(i => i.id === supplier_id)?.address?.legal_business_name}</Typography.Text>
      },
      width: 200
    },
    {
      title: t('目的地1'),
      code: 'destination_id',
      name: 'destination_id',
      render: (destination_id: number) => {
        return <Typography.Text>{locations?.data?.find(i => i.id === destination_id)?.name}</Typography.Text>
      },
      width: 200
    },
    {
      title: t('状态'),
      code: 'status',
      name: 'status',
      render: (status: number) => {
        return (<div style={{ display: 'inline-block' }}>{getPurchaseStatus(t, status, true)}</div>)
      },
      width: 120
    },
    {
      title: t('收货数量'),
      code: 'id',
      name: 'id',
      render: (_, row: PurchaseListRes) => {
        return (
          <Flex onMouseDown={e => { e.stopPropagation() }} vertical gap={8} style={{ marginTop: 4, paddingRight: 12, cursor: 'default' }}>
            <Progress
              purchasing={row.purchasing}
              received={row.received}
              rejected={row.rejected}
            />
            <Popover
              arrow={false}
              placement={'bottomLeft'}
              trigger={'click'}
              content={
                <Detail
                  received={row.received}
                  purchasing={row.purchasing}
                  rejected={row.rejected}
                  vertical
                />
              }
              overlayInnerStyle={{ padding: '16px 8px' }}
            >
              <Flex align={'center'} className={styles.more}>
                {row.received + row.rejected} / {row.purchasing}
                <IconChevronDown style={{ marginLeft: 4, marginTop: -1 }} size={13} />
              </Flex>
            </Popover>
          </Flex>
        )
      },
      width: 150
    },
    {
      title: t('总额'),
      code: 'total',
      name: 'total',
      render: (total: number) => <div>{formatPrice(total, '$')}</div>,
      width: 120
    },
    {
      title: t('预计配送日期'),
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
                  {t('创建采购单')}
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
