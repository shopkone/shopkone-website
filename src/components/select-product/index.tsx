import { useEffect, useState } from 'react'
import { IconAlertCircleFilled } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Flex } from 'antd'

import { ProductListApi, ProductListReq, ProductListRes } from '@/api/product/list'
import SLoading from '@/components/s-loading'
import SModal from '@/components/s-modal'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import Filters from '@/components/select-product/filters'
import Status from '@/components/status'
import { VariantStatus } from '@/constant/product'
import { formatPrice } from '@/utils/num'

export default function SelectProduct () {
  const [params, setParams] = useState<ProductListReq>({ page: 1, page_size: 20 })
  const [selected, setSelected] = useState<number[]>([])

  const list = useRequest(ProductListApi, { manual: true })

  const onClickRow = (row: ProductListRes) => {
    setSelected(selected.includes(row.id) ? selected.filter(id => id !== row.id) : [...selected, row.id])
  }

  const columns: STableProps['columns'] = [
    { title: 'Products', code: 'title', name: 'title', width: 300 },
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
      title: 'Status',
      code: 'status',
      name: 'status',
      width: 120,
      render: (status: VariantStatus) => {
        if (status === VariantStatus.Published) {
          return <Status borderless type={'success'}>Active</Status>
        }
        return <Status borderless type={'default'}>Draft</Status>
      }
    }
  ]

  useEffect(() => {
    list.run(params)
  }, [params])

  return (
    <SModal width={1000} title={'Select products'} open>
      <div style={{ height: 600, overflowY: 'auto', paddingBottom: 24 }}>
        <Filters />
        <STable
          loading={list.loading}
          init={!!list.data}
          columns={columns}
          data={list.data?.list || []}
          rowSelection={{
            value: selected,
            onChange: setSelected
          }}
          onRowClick={onClickRow}
        />
        <Flex justify={'center'} align={'center'} gap={12} style={{ paddingTop: 24 }}>
          <div><SLoading size={20} /></div>
          Loading
        </Flex>
      </div>
    </SModal>
  )
}
