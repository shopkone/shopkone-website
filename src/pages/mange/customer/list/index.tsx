import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Button } from 'antd'

import { CustomerListApi, CustomerListReq, CustomerListRes } from '@/api/customer/list'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SEmpty from '@/components/s-empty'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import Filters from '@/pages/mange/customer/list/filters'

export default function CustomerList () {
  const { t } = useTranslation('customers', { keyPrefix: 'list' })
  const nav = useNavigate()
  const [params, setParams] = useState<CustomerListReq>({ page: 1, page_size: 20 })
  const list = useRequest(CustomerListApi, { manual: true })

  const columns: STableProps['columns'] = [
    {
      title: t('姓名'),
      code: 'name',
      name: 'name',
      render: (_, row: CustomerListRes) => {
        return [row.first_name, row.last_name].filter(Boolean).join(' ')
      },
      lock: true
    },
    {
      title: t('联系方式'),
      code: 'concat',
      name: 'concat',
      render: (_, row: CustomerListRes) => {
        return row.email || row.phone
      }
    },
    {
      title: t('邮箱订阅状态'),
      code: 'email_subscribe',
      name: 'email_subscribe'
    },
    {
      title: t('地区'),
      code: 'area',
      name: 'area'
    },
    {
      title: t('订单数量'),
      code: 'order_count',
      name: 'order_count'
    },
    {
      title: t('消费金额'),
      code: 'cost_price',
      name: 'cost_price'
    }
  ]

  useEffect(() => {
    list.run(params)
  }, [params])

  return (
    <Page
      header={
        <SRender render={list?.data?.list?.length ? !list.loading : null}>
          <Button onClick={() => { nav('change') }} type={'primary'}>
            {t('添加客户')}
          </Button>
        </SRender>
      }
      title={t('客户')}
    >
      <SCard loading={list.loading} styles={{ body: { padding: '8px 0 0 0' } }}>
        <Filters />
        <STable
          page={{
            current: params.page,
            pageSize: params.page_size,
            total: list?.data?.total,
            onChange: (page, page_size) => {
              setParams({ ...params, page, page_size })
            }
          }}
          onRowClick={(row) => { nav(`change/${row.id}`) }}
          columns={columns}
          data={list?.data?.list || []}
          rowSelection={{
            value: [],
            onChange: () => {},
            width: 50
          }}
        >
          <SEmpty type={'searching'}>
            <Button type={'primary'}>{t('添加客户')}</Button>
          </SEmpty>
        </STable>
      </SCard>
    </Page>
  )
}
