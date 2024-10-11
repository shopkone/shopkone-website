import { useEffect, useMemo, useState } from 'react'
import { IconPhoto, IconTag, IconTrash } from '@tabler/icons-react'
import { Button, Empty, Flex } from 'antd'

import { FileType } from '@/api/file/add-file-record'
import { ProductListByIdsRes, useProductListByIds } from '@/api/product/list-by-ids'
import FileImage from '@/components/file-image'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import SelectProduct from '@/components/select-product'
import Status from '@/components/status'
import { VariantStatus } from '@/constant/product'
import { useOpen } from '@/hooks/useOpen'
import { formatPrice } from '@/utils/num'

export interface ProductsProps {
  onChange?: (value: number[]) => void
  value?: number[]
}

export default function Products (props: ProductsProps) {
  const { value, onChange } = props
  const selectInfo = useOpen<number[]>([])
  const products = useProductListByIds()
  const [select, setSelect] = useState<number[]>([])
  const [page, setPage] = useState({ current: 1, pageSize: 20 })

  const pageValue = useMemo(() => {
    if (!value) return []
    return value.filter((item, index) => {
      const start = (page.current - 1) * page.pageSize
      const end = start + page.pageSize
      return index >= start && index < end
    })
  }, [value, page])

  const columns: STableProps['columns'] = [
    {
      title: 'Product',
      code: 'product',
      name: 'product',
      render: (_, row: ProductListByIdsRes) => (
        <Flex align={'center'} gap={16}>
          <SRender render={row.image}>
            <FileImage size={16} width={32} height={32} src={row.image} type={FileType.Image} />
          </SRender>
          <SRender render={!row.image}>
            <Flex align={'center'} justify={'center'} style={{ width: 34, height: 34, background: '#f5f5f5', border: '1px solid #eee', borderRadius: 8 }}>
              <IconPhoto color={'#ddd'} />
            </Flex>
          </SRender>
          <div>{row.title}1</div>
        </Flex>
      ),
      width: 250,
      lock: true
    },
    {
      title: 'Price',
      code: 'price',
      name: 'price',
      render: (_, row: ProductListByIdsRes) => {
        const maxPrice = row.max_price
        const minPrice = row.min_price
        if (maxPrice === minPrice) return formatPrice(maxPrice, '$')
        return <div>{formatPrice(minPrice, '$')} ~ {formatPrice(maxPrice, '$')}</div>
      },
      width: 100
    },
    {
      title: 'Status',
      code: 'status',
      name: 'status',
      width: 80,
      render: (status: VariantStatus) => {
        if (status === VariantStatus.Published) {
          return <Status borderless type={'success'}>Active</Status>
        }
        return <Status borderless type={'default'}>Draft</Status>
      }
    },
    {
      title: '',
      code: 'id',
      name: 'id',
      width: 50,
      render: (_, row: ProductListByIdsRes) => (
        <Button size={'small'} type={'text'} style={{ width: 26, height: 26 }}>
          <IconTrash size={16} style={{ position: 'relative', left: -4, top: 1 }} />
        </Button>
      )
    }
  ]

  useEffect(() => {
    products.run(pageValue || [])
  }, [pageValue])

  return (
    <SCard
      extra={
        <SRender render={value?.length}>
          <Button onClick={() => { selectInfo.edit(value || []) }}>
            Select products
          </Button>
        </SRender>
      }
      loading={products.loading ? !products?.data?.length : false}
      title={'Products'}
      className={'fit-width'}
    >
      <SRender render={!value?.length}>
        <Empty
          image={
            <IconTag size={48} color={'#ddd'} />
          }
          style={{ paddingBottom: 32 }}
          description={(
            <Flex vertical gap={12}>
              <div>
                There are no products in this collection.
              </div>
              <div>
                <Button onClick={() => { selectInfo.edit(value || []) }}>
                  Select products
                </Button>
              </div>
            </Flex>
          )}
        />
      </SRender>

      <SRender render={value?.length}>
        <STable
          borderless
          className={'table-border'}
          width={600}
          rowSelection={{
            value: select,
            onChange: setSelect
          }}
          loading={products.loading}
          init
          columns={columns}
          data={pageValue?.map(item => products.data?.find(row => row.id === item))?.filter(Boolean)}
          page={{
            pageSize: page.pageSize,
            current: page.current,
            total: value?.length || 0,
            onChange: (current, pageSize) => {
              setPage({ current, pageSize })
            }
          }}
          actions={
            <div>asd</div>
          }
        />
      </SRender>

      <SelectProduct
        onConfirm={onChange}
        info={selectInfo}
      />

    </SCard>
  )
}
