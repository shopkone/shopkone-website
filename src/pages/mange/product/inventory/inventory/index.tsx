import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Button, Flex } from 'antd'
import isEqual from 'lodash/isEqual'

import { InventoryListApi, InventoryListReq } from '@/api/inventory/list'
import { LocationListApi } from '@/api/location/list'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import STable from '@/components/s-table'
import Filters from '@/pages/mange/product/inventory/inventory/filters'

export default function Inventory () {
  const { id } = useParams()
  const [params, setParams] = useState<InventoryListReq>({ location_id: 0, page: 1, page_size: 20 })
  const locations = useRequest(async () => await LocationListApi({ active: true }))
  const nav = useNavigate()
  const list = useRequest(InventoryListApi, { manual: true })
  const [selected, setSelected] = useState<number[]>([])

  useEffect(() => {
    if (!id && locations?.data?.[0]?.id) {
      nav(`/products/inventory/${locations.data[0].id}`)
    } else if (id) {
      const newParams = { location_id: Number(id), page: 1, page_size: 20 }
      const isSame = isEqual(params, newParams)
      if (isSame) return
      setParams(newParams)
    }
  }, [locations.data, id])

  useEffect(() => {
    if (!params.location_id) return
    list.run(params)
  }, [params])

  return (
    <Page
      bottom={64}
      title={'Inventory'}
    >
      <SCard styles={{ body: { padding: '8px 0' } }}>
        <Filters />
        <STable
          rowSelection={{
            value: selected,
            onChange: setSelected
          }}
          loading={list.loading}
          init={!!id && !!locations.data && !!list.data}
          columns={
            [
              { code: 'id', name: 'id' },
              { code: 'quantity', name: 'quantity' }
            ]
          }
          data={list.data?.list || []}
          empty={{
            title: 'Keep track of your inventory',
            desc: 'When you enable inventory tracking on your products, you can view and adjust their inventory counts here.',
            actions: (
              <Flex gap={8}>
                <Button onClick={() => { nav('/products/products') }} type={'primary'}>Go to products</Button>
              </Flex>
            )
          }}
          page={{
            total: list?.data?.total || 0,
            current: params.page,
            pageSize: params.page_size,
            onChange: (page, page_size) => {
              setParams({ ...params, page, page_size })
            }
          }}
        />
      </SCard>
    </Page>
  )
}
