import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Button, Flex } from 'antd'
import dayjs from 'dayjs'

import { LocationListApi } from '@/api/location/list'
import { TransferListApi, TransferListReq, TransferListRes } from '@/api/transfers/list'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import { getTransferStatus, TransferStatus } from '@/constant/transfers'
import { useI18n } from '@/hooks/use-lang'
import Filters from '@/pages/mange/product/transfers/list/filters'
import { renderText } from '@/utils/render-text'

export default function TransferList () {
  const locations = useRequest(async () => await LocationListApi({ active: true }))
  const list = useRequest(TransferListApi, { manual: true })
  const [params, setParams] = useState<TransferListReq>({ page: 1, page_size: 20 })
  const nav = useNavigate()
  const t = useI18n()

  const onRowClick = (record: TransferListRes) => {
    nav(`info/${record.id}`)
  }

  const columns: STableProps['columns'] = [
    {
      title: '转移代码',
      code: 'transfer_number',
      name: 'transfer_number',
      width: 100
    },
    {
      title: '发货地',
      code: 'origin_id',
      name: 'origin_id',
      render: (origin_id: number, row: TransferListRes) => {
        return renderText(locations?.data?.find(location => location.id === origin_id)?.name || '')
      },
      width: 180
    },
    {
      title: '目的地',
      code: 'destination_id',
      name: 'destination_id',
      render: (destination_id: number, row: TransferListRes) => {
        return renderText(locations?.data?.find(location => location.id === destination_id)?.name || '')
      },
      width: 180
    },
    {
      title: '预计到达日期',
      code: 'estimated_arrival',
      name: 'estimated_arrival',
      width: 150,
      render: (estimated_arrival: number) => {
        return renderText(estimated_arrival ? dayjs(estimated_arrival * 1000).format('YYYY-MM-DD') : '')
      }
    },
    {
      title: '状态',
      code: 'status',
      name: 'status',
      width: 100,
      render: (status: TransferStatus) => {
        return (
          <div style={{ display: 'inline-block' }}>{getTransferStatus(t, status, true)}</div>
        )
      }
    },
    {
      title: '收货量',
      code: 'id',
      name: 'id',
      width: 200,
      render: (received_quantity: number, row: TransferListRes) => {
        return 123
      }
    }
  ]

  useEffect(() => {
    list.run(params)
  }, [params])

  return (
    <Page
      header={
        <SRender render={list?.data?.list?.length}>
          <Button onClick={() => { nav('create') }} type={'primary'}>创建转移</Button>
        </SRender>
      }
      type={'product'}
      title={'库存转移'}
    >
      <SCard styles={{ body: { padding: '8px 0' } }}>
        <Filters />
        <STable
          loading={list.loading}
          columns={columns}
          page={{
            current: params.page,
            pageSize: params.page_size,
            total: list?.data?.total,
            onChange: (page, page_size) => {
              setParams({ ...params, page, page_size })
            }
          }}
          onRowClick={onRowClick}
          data={list?.data?.list || []}
          empty={{
            desc: '在地点之间移动库存',
            title: '转移和跟踪您的各个业务地点的库存',
            actions: (
              <Flex align={'center'}>
                <SRender render={(locations?.data?.length || 0) < 2}>
                  若要创建转移，您需要多个地点,
                  <Button onClick={() => { nav('/settings/locations') }} style={{ fontSize: 13, marginLeft: -1, marginRight: -4 }} type={'link'} size={'small'}>
                    添加地点
                  </Button>。
                </SRender>

                <SRender render={(locations?.data?.length || 0) >= 2}>
                  <Button onClick={() => { nav('create') }} type={'primary'}>创建转移</Button>
                </SRender>
              </Flex>
            )
          }}
          init={!locations.loading}
        />
      </SCard>
    </Page>
  )
}
