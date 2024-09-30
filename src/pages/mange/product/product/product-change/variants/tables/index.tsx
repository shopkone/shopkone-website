import { Flex } from 'antd'

import SSelect from '@/components/s-select'
import STable from '@/components/s-table'
import TableFilter from '@/components/table-filter'
import { useColumns } from '@/pages/mange/product/product/product-change/variants/tables/useColumns'
import { Variant } from '@/pages/mange/product/product/product-change/variants/variant-table'

export interface TablesProps {
  value?: Variant[]
  onChange?: (variants: Variant[]) => void
}

export default function Tables (props: TablesProps) {
  const { value, onChange } = props
  const columns = useColumns()

  return (
    <div className={'fit-width'}>
      <Flex className={'fit-width'} gap={32} align={'center'} style={{ marginBottom: 12, fontSize: 12 }}>
        <Flex style={{ wordBreak: 'keep-all', whiteSpace: 'nowrap' }} align={'center'} gap={8}>
          Filters
          <TableFilter>Test</TableFilter>
          <TableFilter>Test</TableFilter>
          <TableFilter>Test</TableFilter>
        </Flex>
        <Flex style={{ wordBreak: 'keep-all', whiteSpace: 'nowrap' }} align={'center'} gap={8}>
          Group by <SSelect dropdownStyle={{ minWidth: 200 }} size={'small'} />
        </Flex>
        <Flex style={{ wordBreak: 'keep-all', whiteSpace: 'nowrap' }} align={'center'} gap={8}>
          Location <SSelect dropdownStyle={{ minWidth: 200 }} size={'small'} />
        </Flex>
      </Flex>
      <STable init columns={columns} data={value || []} />
    </div>
  )
}
