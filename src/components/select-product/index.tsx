import { useEffect, useState } from 'react'
import { IconAlertCircleFilled, IconPhoto } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Checkbox, Flex } from 'antd'

import { FileType } from '@/api/file/add-file-record'
import { ProductListApi, ProductListReq, ProductListRes } from '@/api/product/list'
import FileImage from '@/components/file-image'
import SLoading from '@/components/s-loading'
import SModal from '@/components/s-modal'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import Filters from '@/components/select-product/filters'
import Status from '@/components/status'
import { VariantStatus } from '@/constant/product'
import { UseOpenType } from '@/hooks/useOpen'
import { formatPrice } from '@/utils/num'

export interface SelectProductProps {
  info: UseOpenType<number[]>
  onConfirm?: (value: number[]) => void
}

export default function SelectProduct (props: SelectProductProps) {
  const { info, onConfirm } = props
  const [params, setParams] = useState<ProductListReq>({ page: 1, page_size: 20 })
  const [selected, setSelected] = useState<number[]>([])

  const list = useRequest(ProductListApi, { manual: true })

  const onClickRow = (row: ProductListRes) => {
    setSelected(selected.includes(row.id) ? selected.filter(id => id !== row.id) : [...selected, row.id])
  }

  const columns: STableProps['columns'] = [
    {
      title: '',
      code: 'id',
      name: 'id',
      render: (id: number, row: ProductListRes) => (
        <Checkbox onClick={() => { onClickRow(row) }} checked={selected.includes(id)} />
      ),
      width: 35
    },
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
      width: 300,
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

  const onOk = () => {
    onConfirm?.(selected)
    info.close()
  }

  const isAllSelect = selected.length === list.data?.total

  const onSelectAll = () => {
  /*   if (selected.length && !isAllSelect && (list?.data?.total !== list?.data?.list.length)) {
      setSelected([])
    }
    setSelected(list.data?.list?.map(item => item.id) || []) */
  }

  useEffect(() => {
    list.run(params)
  }, [params])

  useEffect(() => {
    if (info.open) {
      setSelected(info.data || [])
    }
  }, [info.open])

  return (
    <SModal
      footer={(
        <Flex align={'center'} justify={'space-between'}>
          <Flex gap={12}>
            <Checkbox
              onChange={onSelectAll}
              checked={isAllSelect}
              indeterminate={!isAllSelect && !!selected.length}
            />
            <div>{selected.length} selected</div>
            <span>/</span>
            <div>{list.data?.total} total</div>
          </Flex>
          <Flex gap={12}>
            <Button onClick={info.close}>Cancel</Button>
            <Button onClick={onOk} type={'primary'}>Add</Button>
          </Flex>
        </Flex>
    )}
      width={1000}
      title={'Select products'}
      onCancel={info.close}
      open={info.open}
    >
      <div style={{ height: 600, overflowY: 'auto', paddingBottom: 24 }}>
        <Filters />
        <STable
          loading={list.loading}
          init={!!list.data}
          columns={columns}
          data={list.data?.list || []}
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
