import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconDownload, IconPlus } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex } from 'antd'

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
      lock: true,
      width: 200
    },
    {
      title: t('联系方式'),
      code: 'concat',
      name: 'concat',
      render: (_, row: CustomerListRes) => {
        return row.email || row.phone
      },
      width: 300
    },
    {
      title: t('邮箱订阅状态'),
      code: 'email_subscribe',
      name: 'email_subscribe',
      width: 150
    },
    {
      title: t('地区'),
      code: 'area',
      name: 'area'
    },
    {
      title: t('订单数量'),
      code: 'order_count',
      name: 'order_count',
      width: 150
    },
    {
      title: t('消费金额'),
      code: 'cost_price',
      name: 'cost_price',
      width: 150
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
      <SCard loading={!list.data} styles={{ body: { padding: '8px 0 0 0' } }}>
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
          onRowClick={(row) => { nav(`info/${row.id}`) }}
          columns={columns}
          data={list?.data?.list || []}
          rowSelection={{
            value: [],
            onChange: () => {},
            width: 50
          }}
        >
          <SEmpty
            title={t('添加和管理你的客户')}
            desc={t('在此添加和管理注册或下单的客户，你也可直接导入客户')}
            type={'searching'}
          >
            <Flex align={'center'} gap={12}>
              <Button>
                <IconDownload className={'fpt1'} size={15} />
                <div>{t('导入')}</div>
              </Button>
              <Button>
                <IconDownload className={'fpt1'} size={15} />
                <div>{t('导入 Shopify')}</div>
              </Button>
              <Button onClick={() => { nav('change') }} type={'primary'}>
                <IconPlus className={'fpt1'} size={15} />
                <div>{t('添加客户')}</div>
              </Button>
            </Flex>
          </SEmpty>
        </STable>
      </SCard>
    </Page>
  )
}
