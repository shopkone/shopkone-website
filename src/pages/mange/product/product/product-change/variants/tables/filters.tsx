import { useEffect } from 'react'
import { Flex } from 'antd'

import TableFilter from '@/components/table-filter'
import { Options } from '@/pages/mange/product/product/product-change/variants/changer/item'

export interface FiltersProps {
  value?: Array<{ label: string, value: string }>
  onChange?: (value: FiltersProps['value']) => void
  options: Options[]
}

export default function Filters (props: FiltersProps) {
  const { options, onChange, value } = props

  const onChangeHandle = (labelId: number, val: string) => {
    const label = options.find(i => i.id === labelId)
    const find = value?.find(i => i.label === label?.name)
    let newValue = value?.map(i => i.label === label?.name ? { ...i, value: val } : i)
    if (!find) {
      newValue = [...(newValue || []), { label: label?.name || '', value: val }]
    }
    onChange?.(newValue)
  }

  useEffect(() => {
    onChange?.([])
  }, [options])

  return (
    <Flex style={{ wordBreak: 'keep-all', whiteSpace: 'nowrap' }} align={'center'} gap={8}>
      Filters
      {
        options.map(option => (
          <TableFilter
            radio={{
              options: option.values?.map(i => ({ label: i.value, value: i.value }))?.filter(i => i.label),
              value: value?.find(i => i.label === option.name)?.value,
              onChange: (value) => {
                onChangeHandle(option.id, (value || '').toString())
              }
            }}
            key={option.id}
          >
            {option.name}
          </TableFilter>
        ))
      }
    </Flex>
  )
}
