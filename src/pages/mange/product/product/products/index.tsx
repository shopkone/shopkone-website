import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconAlertCircleFilled, IconCopy, IconDownload, IconEye, IconPhoto, IconPlus } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Switch, Tooltip } from 'antd'
import dayjs from 'dayjs'

import { FileType } from '@/api/file/add-file-record'
import { ProductListApi, ProductListReq, ProductListRes } from '@/api/product/list'
import FileImage from '@/components/file-image'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import { VariantStatus } from '@/constant/product'
import Filters from '@/pages/mange/product/product/products/filters'
import { formatPrice } from '@/utils/num'
import { renderText } from '@/utils/render-text'

export default function Products () {
  const nav = useNavigate()
  const [params, setParams] = useState<ProductListReq>({ page: 1, page_size: 20 })
  const list = useRequest(ProductListApi, { manual: true })
  const [selected, setSelected] = useState<number[]>([])
  const columns: STableProps['columns'] = [
    {
      title: 'Product',
      code: 'product',
      name: 'product',
      render: (_, row: ProductListRes) => (
        <Flex align={'center'} gap={16}>
          <SRender render={row.image}>
            <FileImage size={16} width={32} height={32} src={row.image} type={FileType.Image} />
          </SRender>
          <SRender render={!row.image}>
            <Flex align={'center'} justify={'center'} style={{ width: 34, height: 34, background: '#f5f5f5', border: '1px solid #eee', borderRadius: 8 }}>
              <IconPhoto color={'#ddd'} />
            </Flex>
          </SRender>
          <div>{row.title}</div>
        </Flex>
      ),
      width: 400,
      lock: true
    },
    {
      title: 'Price',
      code: 'price',
      name: 'price',
      render: (_, row: ProductListRes) => {
        const allPrice = row.variants?.map(variant => variant.price)
        const maxPrice = Math.max(...allPrice)
        const minPrice = Math.min(...allPrice)
        if (maxPrice === minPrice) return formatPrice(maxPrice, '$')
        return <div>{formatPrice(minPrice, '$')} ~ {formatPrice(maxPrice, '$')}</div>
      },
      width: 120
    },
    {
      title: 'SPU',
      code: 'spu',
      name: 'spu',
      render: (spu: string) => renderText(spu),
      width: 150
    },
    {
      title: 'Vendor',
      code: 'vendor',
      name: 'vendor',
      render: (vendor: string) => renderText(vendor),
      width: 150
    },
    {
      title: 'Inventory quantity',
      code: 'quantity',
      name: 'quantity',
      render: (_, row: ProductListRes) => {
        const everyInStock = row.variants?.every(variant => variant.quantity > 0)
        const someInStock = row.variants?.some(variant => variant.quantity > 0)
        return (
          <div>
            <Flex>
              <div>{row.variants?.reduce((sum, variant) => sum + variant.quantity, 0)} on sale</div>
              <SRender render={row.variants?.length !== 1}>
                <span
                  style={{
                    padding: '0 6px',
                    transform: 'scale(1.5)'
                  }}
                >·
                </span>
                {row.variants?.length} variants
              </SRender>
            </Flex>
            <Flex style={{ color: '#ffc107', display: !someInStock ? 'flex' : 'none' }} align={'center'} gap={4}>
              <IconAlertCircleFilled size={15} strokeWidth={2} />
              <Flex><SRender render={!everyInStock && someInStock}>Partial - </SRender>Out of stock</Flex>
            </Flex>
          </div>
        )
      },
      width: 200
    },
    {
      title: 'Created',
      code: 'created_at',
      name: 'id',
      width: 120,
      render: (created_at: number) => {
        if (created_at) return dayjs(created_at).format('MM/DD/YYYY')
        return renderText()
      }
    },
    {
      title: 'Status',
      code: 'status',
      name: 'status',
      width: 150,
      render: (status: VariantStatus) => (
        <Flex
          style={{ cursor: 'default' }} onClick={e => {
            e.stopPropagation()
          }} align={'center'} gap={8}
        >
          <Switch size={'small'} checked={status === VariantStatus.Published} />
          <SRender style={{ fontSize: 12, position: 'relative', top: 1 }} render={status === VariantStatus.Published}>
            Active
          </SRender>
          <SRender style={{ fontSize: 12, position: 'relative', top: 1 }} render={status !== VariantStatus.Published}>
            Draft
          </SRender>
        </Flex>
      )
    },
    {
      title: 'Action',
      code: 'action',
      name: 'action',
      render: () => (
        <Flex justify={'center'} align={'center'} style={{ marginLeft: -6, cursor: 'default' }} onClick={e => { e.stopPropagation() }} gap={12}>
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
        </Flex>
      ),
      width: 100,
      lock: true,
      align: 'center'
    }
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
        <Filters />
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
