import { useEffect, useState } from 'react'
import { Flex, Form } from 'antd'

import STable from '@/components/s-table'
import TableFilter from '@/components/table-filter'
import { Option, Variant } from '@/pages/mange/product/product/product-change/variants/state'
import GroupBy from '@/pages/mange/product/product/product-change/variants/table/group-by'
import useColumns from '@/pages/mange/product/product/product-change/variants/table/use-columns'

export interface TableProps {
  variants: Variant[]
  options: Option[]
  loading: boolean
  onChange: (variants: Variant[]) => void
}

export default function Table (props: TableProps) {
  const { variants, options, loading, onChange } = props
  const form = Form.useFormInstance()
  const [groupVariants, setGroupVariants] = useState<Variant[]>([])
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([])

  const { columns } = useColumns({
    variants: groupVariants,
    setVariants: setGroupVariants
  })

  useEffect(() => {
    form.setFieldValue('variants', groupVariants)
    onChange(groupVariants)
  }, [groupVariants])

  return (
    <div>
      <Flex style={{ marginBottom: 12 }} align={'center'} gap={48}>
        <Flex align={'center'} gap={8}>
          filter
          <TableFilter>asd</TableFilter>
          <TableFilter>asd</TableFilter>
          <TableFilter>asd</TableFilter>
        </Flex>
        <GroupBy onChange={setGroupVariants} variants={variants} options={options} />
      </Flex>
      <STable
        init
        loading={loading}
        columns={columns}
        data={groupVariants}
        expand={{ value: expandedRowKeys, onChange: setExpandedRowKeys }}
      />
    </div>
  )
}
