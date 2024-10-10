import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconDownload, IconPlus } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Input } from 'antd'

import { ProductListApi, ProductListReq } from '@/api/product/list'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'

import styles from './index.module.less'

export default function Products () {
  const nav = useNavigate()
  const [params, setParams] = useState<ProductListReq>({ page: 1, page_size: 20 })
  const list = useRequest(ProductListApi, { manual: true })
  const [selected, setSelected] = useState<number[]>([])
  const columns: STableProps['columns'] = [
    { title: 'id', code: 'id', name: 'id' }
  ]

  useEffect(() => {
    list.run(params)
  }, [params])

  return (
    <Page
      bottom={64}
      header={
        <SRender render={list?.data?.list?.length}>
          <Flex gap={8}>
            <Button type={'text'}>Export</Button>
            <Button type={'text'}>Import</Button>
            <Button type={'text'}>More actions</Button>
            <Button onClick={() => { nav('change') }} type={'primary'}>Add product</Button>
          </Flex>
        </SRender>
      }
      title={'Products'}
    >
      <SCard styles={{ body: { padding: '8px 0' } }}>
        <SRender render={list?.data?.list?.length}>
          asd
        </SRender>
        <SRender render={list?.data?.list?.length}>
          <Flex align={'center'} justify={'space-between'} style={{ margin: '6px 8px' }}>
            <Input
              className={styles.search}
              placeholder={'Searching all products'}
              size={'small'}
              variant={'filled'}
            />
            <div>
              123
            </div>
          </Flex>
          <div
            style={{
              margin: 0,
              width: '100%'
            }} className={'line'}
          />
        </SRender>
        <STable
          page={{
            current: params.page,
            pageSize: params.page_size,
            total: list?.data?.total,
            onChange: (page, page_size) => {
              if (page !== params.page) {
                setSelected([])
              }
              setParams({ ...params, page, page_size })
            }
          }}
          onRowClick={(row) => {
            nav(`change/${row?.id}`)
          }}
          loading={list.loading}
          rowSelection={{ onChange: setSelected, value: selected }}
          init={!!list.data?.page?.page}
          empty={{
            title: 'Add your products',
            desc: 'Start by stocking your store with products your customers will love',
            actions: (
              <Flex gap={12}>
                <Button>
                  <Flex
                    gap={6} align={'center'} style={{
                      position: 'relative',
                      top: -2
                    }}
                  >
                    <IconDownload size={15} />
                    <div>Import</div>
                  </Flex>
                </Button>
                <Button>
                  <Flex
                    gap={6} align={'center'} style={{
                      position: 'relative',
                      top: -2
                    }}
                  >
                    <IconDownload size={15} />
                    <div>Import by Shopify</div>
                  </Flex>
                </Button>
                <Button
                  onClick={() => {
                    nav('change')
                  }}
                  type={'primary'}
                >
                  <Flex
                    gap={4} align={'center'} style={{
                      position: 'relative',
                      top: -2
                    }}
                  >
                    <IconPlus size={14} />
                    <div>Add products</div>
                  </Flex>
                </Button>
              </Flex>
            )
          }}
          columns={columns}
          data={list?.data?.list || []}
        />
      </SCard>
    </Page>
  )
}
