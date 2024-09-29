import { STableProps } from '@/components/s-table'

export const useColumns = (): STableProps['columns'] => {
  return [
    { title: 'Variant', name: 'name', code: 'name' }
  ]
}
