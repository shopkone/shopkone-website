import STable, { STableProps } from '@/components/s-table'
import { Variant } from '@/pages/product/product/product-change/variants/variant-table/index'

export interface TableProps {
  value: Variant[]
}

export default function Table (props: TableProps) {
  const columns: STableProps['columns'] = [
    { title: 'Variant', code: 'name', name: 'name' }
  ]

  return (
    <STable columns={columns} data={[]} />
  )
}
