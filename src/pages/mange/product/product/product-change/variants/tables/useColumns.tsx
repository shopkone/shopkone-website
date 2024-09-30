import { STableProps } from '@/components/s-table'

export const useColumns = (): STableProps['columns'] => {
  return [
    { title: 'Variant', name: 'id', code: 'id' }
  ]
}
