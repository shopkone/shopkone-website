import { Button, Flex } from 'antd'

import TableFilter from '@/components/table-filter'
import { Option } from '@/pages/mange/product/product/product-change/variants/state'

export interface FiltersProps {
  value: Record<string, string>
  onChange: (value: Record<string, string>) => void
  options: Option[]
}

export default function Filters (props: FiltersProps) {
  const { options, onChange, value } = props

  if (options.length < 2) return null

  return (
    <Flex align={'center'} gap={8}>
      Filters
      {
          options.map(option => (
            <TableFilter
              radio={{
                onChange: (v) => {
                  onChange({
                    ...value,
                    [option.name]: v?.toString() || ''
                  })
                },
                value: value[option.name],
                options: option.values.filter(i => i.value).map(v => ({
                  label: v.value,
                  value: v.value
                }))
              }}
              key={option.id}
            >
              {option.name}
            </TableFilter>
          ))
        }
      <Button type={'link'}>
        Clear all
      </Button>
    </Flex>
  )
}
