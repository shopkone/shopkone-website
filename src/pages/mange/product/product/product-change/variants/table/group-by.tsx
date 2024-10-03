import { useEffect, useState } from 'react'
import { Flex } from 'antd'

import SSelect from '@/components/s-select'
import { Option } from '@/pages/mange/product/product/product-change/variants/changer'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'

// @ts-expect-error
import Handle from './group-handle?worker'

export interface GroupByProps {
  options: Option[]
  variants: Variant[]
  onChange: (grouped: Variant[]) => void
}

export default function GroupBy (props: GroupByProps) {
  const { options, variants, onChange } = props
  const [groupName, setGroupName] = useState('')

  useEffect(() => {
    const handle: Worker = new Handle()
    handle.postMessage({ options, variants, groupName })
    handle.onmessage = (e) => {
      onChange(e.data)
    }
  }, [variants, groupName])

  useEffect(() => {
    const option = options.find(i => i.name === groupName)
    if (!option && options.length >= 2) {
      setGroupName(options?.[0]?.name)
    }
  }, [variants, groupName])

  if (options.length < 2) return null

  return (
    <Flex align={'center'} gap={8}>
      <div style={{ flexShrink: 0 }}>By group</div>
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
