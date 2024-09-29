import { Flex } from 'antd'

import SSelect from '@/components/s-select'
import STable from '@/components/s-table'
import TableFilter from '@/components/table-filter'
import { useColumns } from '@/pages/mange/product/product/product-change/variants/tables/useColumns'

export default function Tables () {
  const columns = useColumns()

  return (
    <div>
      <Flex gap={32} align={'center'} style={{ marginBottom: 12, fontSize: 12 }}>
        <Flex align={'center'} gap={8}>
          Filters
          <TableFilter>Test</TableFilter>
          <TableFilter>Test</TableFilter>
          <TableFilter>Test</TableFilter>
        </Flex>
        <Flex align={'center'} gap={8}>
          Group by <SSelect size={'small'} />
        </Flex>
        <Flex align={'center'} gap={8}>
          Location <SSelect size={'small'} />
        </Flex>
      </Flex>
      <STable init columns={columns} data={[]} />
    </div>
  )
}
