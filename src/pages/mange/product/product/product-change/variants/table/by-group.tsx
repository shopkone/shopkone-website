import { useEffect } from 'react'
import { Flex } from 'antd'

import SSelect from '@/components/s-select'
import { Option } from '@/pages/mange/product/product/product-change/variants/state'

export interface ByGroupProps {
  options: Option[]
  value?: string
  onChange?: (value: string) => void
}

export default function ByGroup (props: ByGroupProps) {
  const { options, value, onChange } = props
  useEffect(() => {
    if (options?.length === 1) {
      onChange?.('')
      return
    }
    const option = options.find(item => item.name === value)
    if (!option) {
      onChange?.(options?.[0]?.name)
    }
  }, [options, value])

  return (
    <Flex align={'center'} gap={8}>
      <div style={{ whiteSpace: 'nowrap' }} className={'tips'}>Group by</div>
      <SSelect
        value={value}
        onChange={onChange}
        style={{ minWidth: 120 }}
        dropdownStyle={{ width: 200 }}
        size={'small'}
        options={options.map(option => ({ label: option.name, value: option.name }))}
      />
    </Flex>
  )
}
