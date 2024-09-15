import { useState } from 'react'
import { cloneDeep } from 'lodash'

import SInputNumber from '@/components/s-input-number'
import STable, { STableProps } from '@/components/s-table'
import { Variant } from '@/pages/product/product/product-change/variants/variant-table/index'

export interface TableProps {
  value: Variant[]
  onChange: (value: Variant[]) => void
}

export default function Table (props: TableProps) {
  const { value, onChange } = props
  const [expands, setExpands] = useState<number[]>([])

  const updateFormData = (row: Variant, key: string, v: any) => {
    if (row.children?.length) {
      row.children = row.children?.map((item: Variant) => {
        return { ...item, [key]: v }
      })
    } else {
      // @ts-expect-error
      row[key] = v
    }
    const newValue = value.map((item: Variant) => {
      return item.id === row.id ? row : item
    })
    onChange(cloneDeep(newValue))
  }

  const columns: STableProps['columns'] = [
    {
      title: 'Variant', code: 'id', name: 'id'
    },
    {
      title: 'price',
      code: 'price',
      name: 'price',
      render: (price: number, row: Variant) => {
        return (
          <SInputNumber
            money
            placeholder={'0.00'}
            value={price}
            onChange={(v) => { updateFormData(row, 'price', v) }}
          />
        )
      }
    }
  ]

  return (
    <STable
      expand={{ value: expands, onChange: setExpands }}
      columns={columns}
      data={value}
      emptyContent={<div style={{ fontSize: 13 }}>Please set up variant options</div>}
    />
  )
}
