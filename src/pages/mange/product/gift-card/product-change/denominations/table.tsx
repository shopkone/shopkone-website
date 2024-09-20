import { DeleteFour } from '@icon-park/react'
import { useMemoizedFn } from 'ahooks'
import { Button } from 'antd'

import SInputNumber from '@/components/s-input-number'
import STable, { STableProps } from '@/components/s-table'
import { genId } from '@/utils/random'

export interface TableProps {
  value?: Array<{ id: number, image?: string, denomination: number, selling_price: number, inventory?: number }>
  onChange?: (value: TableProps['value']) => void
}

export default function Table (props: TableProps) {
  const { value = [] } = props

  const onAdd = useMemoizedFn(() => {
    props.onChange?.([...value, { id: genId(), denomination: 0, selling_price: 0 }])
  })

  const onRemove = useMemoizedFn((id: number) => {
    console.log(id)
    props.onChange?.(value.filter(v => v.id !== id))
  })

  const columns: STableProps['columns'] = [
    {
      title: 'Image',
      name: 'image',
      width: 80
    },
    {
      title: 'Denomination',
      name: 'denomination',
      render: () => (
        <SInputNumber money />
      ),
      width: 100
    },
    {
      title: 'Selling price',
      name: 'selling_price',
      render: () => (
        <SInputNumber money />
      ),
      width: 100
    },
    {
      title: 'Inventory',
      name: 'inventory',
      render: () => (
        <SInputNumber uint />
      ),
      width: 100
    },
    {
      title: '',
      name: 'id',
      code: 'id',
      render: (id: number) => (
        <Button onClick={() => { onRemove(id) }} style={{ width: 28, height: 28, padding: 0, marginLeft: 4 }}>
          <DeleteFour size={14} style={{ position: 'relative', top: 1 }} />
        </Button>
      ),
      width: 40,
      hidden: value.length === 1
    }
  ]

  return (
    <div>
      <STable
        rowKey={'id'}
        borderless
        style={{ border: '1px solid #d0d3d6', borderRadius: 12, overflow: 'hidden' }}
        columns={columns}
        data={value}
      />
      <Button onClick={onAdd} style={{ marginTop: 16 }}>
        Add denomination
      </Button>
    </div>
  )
}
