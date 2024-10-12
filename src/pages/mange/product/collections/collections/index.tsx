import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconCopy, IconEye, IconPhoto, IconTrash } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Tooltip } from 'antd'

import { ProductCollectionListApi, ProductCollectionListReq, ProductCollectionListRes } from '@/api/collection/list'
import { FileType } from '@/api/file/add-file-record'
import FileImage from '@/components/file-image'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import { CollectionType } from '@/pages/mange/product/collections/change'
import Filters from '@/pages/mange/product/collections/collections/filters'

export default function Collections () {
  const [params, setParams] = useState<ProductCollectionListReq>({ page: 1, page_size: 20 })
  const list = useRequest(ProductCollectionListApi, { manual: true })
  const nav = useNavigate()
  const [selected, setSelected] = useState<number[]>([])

  const columns: STableProps['columns'] = [
    {
      title: 'Collection',
      code: 'collection',
      name: 'collection',
      render: (_, row: ProductCollectionListRes) => (
        <Flex align={'center'} gap={16}>
          <SRender render={row.cover}>
            <FileImage size={16} width={32} height={32} src={row.cover} type={FileType.Image} />
          </SRender>
          <SRender render={!row.cover}>
            <Flex align={'center'} justify={'center'} style={{ width: 34, height: 34, background: '#f5f5f5', border: '1px solid #eee', borderRadius: 8 }}>
              <IconPhoto color={'#ddd'} />
            </Flex>
          </SRender>
          <div>{row.title}</div>
        </Flex>
      ),
      width: 400
    },
    {
      title: 'Type',
      code: 'collection_type',
      name: 'collection_type',
      render: (collection_type: CollectionType) => {
        if (collection_type === CollectionType.Auto) return 'Auto'
        return 'Manual'
      },
      width: 200
    },
    {
      title: 'Product quantity',
      code: 'product_quantity',
      name: 'product_quantity',
      width: 200
    },
    {
      title: 'Action',
      code: 'action',
      name: 'action',
      render: () => (
        <Flex align={'center'} style={{ marginLeft: -6, cursor: 'default' }} onClick={e => { e.stopPropagation() }} gap={12}>
          <Tooltip title={'Preview'}>
            <Button size={'small'} type={'text'} style={{ width: 26, height: 26 }}>
              <IconEye style={{ position: 'relative', left: -5 }} size={18} />
            </Button>
          </Tooltip>
          <Tooltip title={'Duplicate'}>
            <Button size={'small'} type={'text'} style={{ width: 26, height: 26 }}>
              <IconCopy style={{ position: 'relative', left: -2, top: 1 }} size={14} />
            </Button>
          </Tooltip>
          <Tooltip title={'Duplicate'}>
            <Button size={'small'} type={'text'} style={{ width: 26, height: 26 }}>
              <IconTrash style={{ position: 'relative', left: -3, top: 1 }} size={15} />
            </Button>
          </Tooltip>
        </Flex>
      ),
      lock: true,
      width: 200
    }
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
      <SCard styles={{ body: { padding: '8px 0' } }}>
        <Filters />
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
      </SCard>
    </Page>
  )
}
