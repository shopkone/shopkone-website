import { useEffect, useRef, useState } from 'react'
import { IconTrash } from '@tabler/icons-react'
import { Button } from 'antd'
import isEqual from 'lodash/isEqual'

import { STableProps } from '@/components/s-table'
import { Option, Variant } from '@/pages/mange/product/product/product-change/variants/state'
import ColumnNumber from '@/pages/mange/product/product/product-change/variants/table/column-number'
import ColumnPrice from '@/pages/mange/product/product/product-change/variants/table/column-price'
import ColumnTitle from '@/pages/mange/product/product/product-change/variants/table/column-title'
import ColumnVariant from '@/pages/mange/product/product/product-change/variants/table/column-variant'
import ColumnWeight from '@/pages/mange/product/product/product-change/variants/table/column-weight'
import ColumnsInput from '@/pages/mange/product/product/product-change/variants/table/columns-input'

// @ts-expect-error
import GroupNameHandle from './handle?worker'

export interface useColumnsParams {
  data: Variant[]
  onChange: (variants: Variant[]) => void
  options: Option[]
  groupName: string
}

export const useColumns = (params: useColumnsParams) => {
  const { data, onChange, options, groupName } = params
  const [expands, setExpands] = useState<number[]>([])
  const preData = useRef<Variant[]>([])

  const columns: STableProps['columns'] = [
    {
      title: <ColumnTitle />,
      name: 'id',
      code: 'id',
      render: (id: number, row: Variant) => <ColumnVariant groupName={groupName} item={row} expands={expands} />,
      width: 300,
      lock: true
    },
    {
      title: 'Price',
      name: 'price',
      code: 'price',
      render: (money: number, row: Variant) => <ColumnPrice item={row} />,
      width: 150
    },
    {
      title: 'Cost per item',
      name: 'cost_per_item',
      code: 'cost_per_item',
      render: (money: number, row: Variant) => <ColumnPrice item={row} />,
      width: 150
    },
    {
      title: 'Compare at price',
      name: 'compare_at_price',
      code: 'compare_at_price',
      render: (money: number, row: Variant) => <ColumnPrice item={row} />,
      width: 150
    },
    {
      title: 'Inventory',
      name: 'inventory',
      code: 'inventory',
      render: () => <ColumnNumber />,
      width: 150
    },
    {
      title: 'Weight',
      name: 'weight',
      code: 'weight',
      render: (weight: number, row: Variant) => <ColumnWeight row={row} />,
      width: 150
    },
    {
      title: 'SKU',
      name: 'sku',
      code: 'sku',
      render: (sku: string, row: Variant) => <ColumnsInput row={row} type={'sku'} />,
      width: 200
    },
    {
      title: 'Barcode',
      name: 'barcode',
      code: 'barcode',
      render: (barcode: string, row: Variant) => <ColumnsInput row={row} type={'barcode'} />,
      width: 200
    },
    {
      title: '',
      lock: true,
      code: 'id',
      name: 'id',
      width: 50,
      align: 'center',
      render: () => (
        <Button type={'text'} size={'small'}>
          <IconTrash size={16} />
        </Button>
      )
    }
  ]
  console.log(123)

  useEffect(() => {
    if (isEqual(preData.current, data)) return
    const worker: Worker = new GroupNameHandle()
    worker.postMessage({ groupName, variants: data, options })
    worker.onmessage = (e) => {
      preData.current = data
      onChange(e.data)
    }
  }, [data, groupName])

  return { columns, expands, setExpands }
}
