import { Flex } from 'antd'
import TableFilter from '@/components/table-filter'
import { Option, Variant } from '@/pages/mange/product/product/product-change/variants/state'
import { useEffect, useState } from 'react'

export interface FiltersProps {
  variants: Variant[]
  options: Option[]
  onChange: (variants: Variant[]) => void
}

export default function Filters(props: FiltersProps) {
  const { variants, options, onChange } = props
  const [filters, setFilters] = useState<Record<string, string>>({})

  useEffect(() => {
    const list = variants.filter(variant => {
      return variant.name.every(name => {
        if(!filters[name.label]) return true
        return  filters[name.label] === name.value
      })
    })
    onChange(list)
  }, [filters])

  if(options.length < 2) return  null

  return (
    <Flex align={'center'} gap={8}>
      filter
      {
        options.map(option => (
          <TableFilter
            radio={{
              onChange: (v) => {
                setFilters({...filters, [option.name]: v?.toString() || ""})
              },
              value: filters[option.name],
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
