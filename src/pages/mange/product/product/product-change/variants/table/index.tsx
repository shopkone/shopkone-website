import { useEffect, useState } from 'react'
import { Button, Flex, Form } from 'antd'

import STable from '@/components/s-table'
import { Option, Variant } from '@/pages/mange/product/product/product-change/variants/state'
import Filters from '@/pages/mange/product/product/product-change/variants/table/filters'
import GroupBy from '@/pages/mange/product/product/product-change/variants/table/group-by'
import useColumns from '@/pages/mange/product/product/product-change/variants/table/use-columns'

export interface TableProps {
  variants: Variant[]
  options: Option[]
  loading: boolean
  onChangeGroupVariants: (variants: Variant[]) => void
  onOpenOptions: () => void
}

export default function Table (props: TableProps) {
  const { variants, options, loading, onChangeGroupVariants, onOpenOptions } = props
  const form = Form.useFormInstance()
  const [groupVariants, setGroupVariants] = useState<Variant[]>([])
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([])
  const [filters, setFilters] = useState<Record<string, string>>({})

  const { columns } = useColumns({
    variants: groupVariants,
    setVariants: setGroupVariants
  })

  useEffect(() => {
    form.setFieldValue('variants', groupVariants)
    onChangeGroupVariants(groupVariants)
  }, [groupVariants])

  return (
    <div>
      <Flex style={{ marginBottom: 12 }} align={'center'} gap={48}>
        <Filters value={filters} onChange={setFilters} options={options} />
        <GroupBy filters={filters} onChange={setGroupVariants} variants={variants} options={options} />
      </Flex>
      <STable
        init
        loading={loading}
        columns={columns}
        data={groupVariants}
        expand={{ value: expandedRowKeys, onChange: setExpandedRowKeys }}
        empty={{
          img: 'asd',
          desc: 'adsad',
          title: 'xxx',
          actions: (
            <Flex align={'center'} justify={'center'}>
              <Button type={'primary'} onClick={onOpenOptions}>Edit options</Button>
            </Flex>
          )
        }}
      />
    </div>
  )
}
