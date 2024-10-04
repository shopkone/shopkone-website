import { useEffect, useState } from 'react'
import { Flex } from 'antd'

import SSelect from '@/components/s-select'
import { Option, Variant } from '@/pages/mange/product/product/product-change/variants/state'

// @ts-expect-error
import Handle from './group-handle?worker'

export interface GroupByProps {
  options: Option[]
  variants: Variant[]
  onChange: (grouped: Variant[]) => void
  filters: Record<string, string>
}

export default function GroupBy (props: GroupByProps) {
  const { options, variants, onChange, filters } = props
  const [groupName, setGroupName] = useState('')

  const filterHandle = () => {
    const list: Variant[] = []
    variants.forEach(variant => {
      const isEvery = variant.name.every(item => {
        if (!filters[item.label]) return true
        return filters[item.label] === item.value
      })
      if (isEvery) {
        list.push(variant)
      }
    })
    return list
  }

  useEffect(() => {
    const list = filterHandle()
    const handle: Worker = new Handle()
    handle.postMessage({ options, variants: list, groupName })
    handle.onmessage = (e) => {
      onChange(e.data)
    }
  }, [variants, groupName, filters])

  useEffect(() => {
    const option = options.find(i => i.name === groupName)
    if (!option && options.length >= 2) {
      setGroupName(options?.[0]?.name)
    }
  }, [variants, groupName, options])

  if (options.length < 2) return null

  return (
    <Flex align={'center'} gap={8}>
      <div style={{ flexShrink: 0 }}>Group by</div>
      <SSelect
        value={groupName}
        onChange={setGroupName}
        options={options.map(({ id, name }) => ({
          label: name,
          value: id
        }))}
        size={'small'}
        dropdownStyle={{ minWidth: 200 }}
        style={{ minWidth: 120 }}
      />
    </Flex>
  )
}
