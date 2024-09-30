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
import { isEqualHandle } from '@/utils/isEqual'

// @ts-expect-error
import GroupNameHandle from './handle?worker'

export interface useColumnsParams {
  data: Variant[]
  onChange: (variants: Variant[]) => void
  onUpdate?: (variants: Variant[]) => void
  options: Option[]
  groupName: string
}

export const useColumns = (params: useColumnsParams) => {
  const { data, onChange, options, groupName, onUpdate } = params
  const [expands, setExpands] = useState<number[]>([])
  const preData = useRef<Variant[]>([])
  const preGroupName = useRef<string>()

  const onUpdateData = (row?: Variant) => {
    if (!row) return
    const newData = data.map(item => item.id === row.id ? row : item)
    onUpdate?.(newData)
  }

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
      render: (money: number, row: Variant) => <ColumnPrice onChange={onUpdateData} type={'price'} item={row} />,
      width: 150
    },
    {
      title: 'Cost per item',
      name: 'cost_per_item',
      code: 'cost_per_item',
      render: (money: number, row: Variant) => <ColumnPrice onChange={onUpdateData} type={'cost_per_item'} item={row} />,
      width: 150
    },
    {
      title: 'Compare at price',
      name: 'compare_at_price',
      code: 'compare_at_price',
      render: (money: number, row: Variant) => <ColumnPrice onChange={onUpdateData} type={'compare_at_price'} item={row} />,
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

  const isSameData = () => {
    const v1 = data.map(item => ({ id: item.id, isParent: item.isParent, name: item.name, parentId: item.parentId }))
    const v2 = preData.current.map(item => ({ id: item.id, isParent: item.isParent, name: item.name, parentId: item.parentId }))
    return isEqualHandle(v1, v2)
  }

  const onChangeHandle = () => {
    if (isSameData() && isEqual(preGroupName.current, groupName)) return
    const worker: Worker = new GroupNameHandle()
    worker.postMessage({ groupName, variants: data, options })
    preData.current = data
    preGroupName.current = groupName
    worker.onmessage = (e) => {
      onChange(e.data)
    }
  }

  useEffect(() => {
    onChangeHandle()
  }, [data, groupName])

  return { columns, expands, setExpands }
}
