import { Button, Flex } from 'antd'

import SRender from '@/components/s-render'
import FilterRadio from '@/components/table-filter/filter-radio'
import { Option } from '@/pages/mange/product/product/product-change/variants/state'

export interface FiltersProps {
  value: Record<string, string>
  onChange: (value: Record<string, string>) => void
  options: Option[]
}

export default function Filters (props: FiltersProps) {
  const { options, onChange, value } = props

  const onClearAll = () => {
    onChange({})
  }

  if (options.length < 2) return null

  return (
    <Flex align={'center'} gap={8}>
      Filters
      {
          options.map(option => (
            <FilterRadio
              options={option.values.filter(i => i.value).map(v => ({ label: v.value, value: v.value }))}
              key={option.id}
              onChange={(v) => { onChange({ ...value, [option.name]: v?.toString() || '' }) }}
              value={value[option.name]}

            >
              {option.name}
            </FilterRadio>
          ))
        }
      <SRender render={Object.values(value).filter(v => v).length}>
        <Button onClick={onClearAll} type={'link'}>
          Clear all
        </Button>
      </SRender>
    </Flex>
  )
}
