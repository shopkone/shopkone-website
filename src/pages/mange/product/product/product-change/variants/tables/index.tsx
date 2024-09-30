import { useRef, useState } from 'react'
import { Flex } from 'antd'

import SSelect from '@/components/s-select'
import STable from '@/components/s-table'
import { Options } from '@/pages/mange/product/product/product-change/variants/changer/item'
import ByGroup from '@/pages/mange/product/product/product-change/variants/tables/by-group'
import Filters, { FiltersProps } from '@/pages/mange/product/product/product-change/variants/tables/filters'
import { useColumns } from '@/pages/mange/product/product/product-change/variants/tables/useColumns'
import { Variant } from '@/pages/mange/product/product/product-change/variants/variant-table'

export interface TablesProps {
  value?: Variant[]
  onChange?: (variants: Variant[]) => void
  options: Options[]
}

export default function Tables (props: TablesProps) {
  const { value = [], onChange, options = [] } = props

  const [groupName, setGroupName] = useState('')
  const [filters, setFilters] = useState<FiltersProps['value']>([])
  const isEdit = useRef(true)

  const onChangeHandle = (v: Variant[]) => {
    isEdit.current = true
  }

  console.log(123)

  const { columns, variants, expands, setExpands } = useColumns({ data: value, options, groupName, filters, isEdit: isEdit.current }, onChangeHandle)

  return (
    <div className={'fit-width'}>
      <Flex className={'fit-width'} gap={32} align={'center'} style={{ marginBottom: 12, fontSize: 12 }}>
        <Filters value={filters} onChange={setFilters} options={options} />
        <ByGroup options={options} groupName={groupName} onChangeGroupName={setGroupName} />
        <Flex style={{ wordBreak: 'keep-all', whiteSpace: 'nowrap' }} align={'center'} gap={8}>
          Location <SSelect dropdownStyle={{ minWidth: 200 }} size={'small'} />
        </Flex>
      </Flex>
      <STable
        expand={{ value: expands, onChange: setExpands }}
        init
        columns={columns}
        data={variants}
        width={916}
      />
    </div>
  )
}
