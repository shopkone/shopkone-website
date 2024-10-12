import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Button, Card, Flex } from 'antd'

import { ProductCollectionListApi, ProductCollectionListReq } from '@/api/collection/list'
import Page from '@/components/page'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'

export default function Collections () {
  const [params, setParams] = useState<ProductCollectionListReq>({ page: 1, page_size: 20 })
  const list = useRequest(ProductCollectionListApi, { manual: true })
  const nav = useNavigate()
  const [selected, setSelected] = useState<number[]>([])

  const columns: STableProps['columns'] = [
    { title: 'Collection', code: 'collection', name: 'collection' },
    { title: 'Type', code: 'type', name: 'type' },
    { title: 'Product quantity', code: 'quantity', name: 'quantity' },
    { title: 'Action', code: 'action', name: 'action' }
  ]

  useEffect(() => {
    list.run(params)
  }, [params])

  return (
    <Page
      header={
        <SRender render={list?.data?.list?.length}>
          <Button
            onClick={() => { nav('change') }}
            type={'primary'}
          >
            Create collection
          </Button>
        </SRender>
      }
      bottom={64} title={'Collections'}
    >
      <Card>
        <STable
          rowSelection={{
            value: selected,
            onChange: setSelected
          }}
          init={!!list.data}
          columns={columns}
          data={list.data?.list || []}
          onRowClick={(row, rowIndex) => {
            nav(`/products/collections/change/${row.id}`)
          }}
          empty={{
            title: 'Group your products into categories',
            desc: 'Use collections to organize your products into categories and galleries for your online store.',
            actions: (
              <Flex gap={8}>
                <Button
                  onClick={() => { nav('change') }}
                  type={'primary'}
                >
                  Create collection
                </Button>
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
      </Card>
    </Page>
  )
}
