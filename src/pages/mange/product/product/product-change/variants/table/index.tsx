import STable from '@/components/s-table'

import { Variant } from '../state'

export interface TableProps {
  value?: Variant[]
  onChange?: (variants: Variant[]) => void
}

export default function Table (props: TableProps) {
  const { value = [], onChange } = props
  return (
    <STable
      init
      columns={[{ code: 'id', name: 'id' }]}
      data={value}
    />
  )
}
