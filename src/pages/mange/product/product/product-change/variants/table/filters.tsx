import { Flex } from 'antd'
import TableFilter from '@/components/table-filter'
import { Option, Variant } from '@/pages/mange/product/product/product-change/variants/state'

export interface FiltersProps {
  variants: Variant[]
  options: Option[]
  onChange: (options:Option[]) => void
}

export default function Filters(props: FiltersProps) {
  const { variants, options, onChange } = props

  if(!options.length) return  null

  return (
    <Flex align={'center'} gap={8}>
      filter
      {
        options.map(option => (
          <TableFilter
            radio={{
              options: option.values.filter(i => i.value).map(v => ({label:v.value, value:v.value}))
            }}
            key={option.id}>
            {option.name}
          </TableFilter>
        ))
      }
    </Flex>
  )
}
