import { ReactNode } from 'react'
import { Flex } from 'antd'

import FilterRadio from '@/components/table-filter/filter-radio'
import { Option } from '@/pages/mange/product/product/product-change/variants/state'

export interface FiltersProps {
  value: Record<string, string>
  onChange: (value: Record<string, string>) => void
  options: Option[]
  setLabels: (labels: Record<string, ReactNode>) => void
  labels: Record<string, ReactNode>
}

export default function Filters (props: FiltersProps) {
  const { options, onChange, value, setLabels, labels } = props

  if (!options.length) return <div />

  return (
    <Flex style={{ marginBottom: 12 }} align={'center'} gap={8}>
      Filters
      {
          options.map(option => (
            <FilterRadio
              options={option.values.filter(i => i.value).map(v => ({ label: v.value, value: v.value }))}
              key={option.id}
              onChange={(v) => { onChange({ ...value, [option.name]: v?.toString() || '' }) }}
              value={value[option.name]}
              onLabelChange={(l) => { setLabels({ ...labels, [option.name]: l }) }}
            >
              {option.name}
            </FilterRadio>
          ))
        }
    </Flex>
  )
}
