import { useEffect, useMemo } from 'react'
import { Flex } from 'antd'

import SSelect from '@/components/s-select'
import { Options } from '@/pages/mange/product/product/product-change/variants/changer/item'

export interface ByGroupProps {
  groupName?: string
  onChangeGroupName?: (groupName: string) => void
  options: Options[]
}

export default function ByGroup (props: ByGroupProps) {
  const { groupName, onChangeGroupName, options } = props

  const selectOptions = useMemo(() => options.map(item => ({
    label: item.name,
    value: item.name
  })), [options])

  useEffect(() => {
    const find = options?.find(item => item.name === groupName)
    if (!find || !groupName) {
      onChangeGroupName?.(options?.[0]?.name)
    }
  }, [options, groupName])

  return (
    <Flex style={{ wordBreak: 'keep-all', whiteSpace: 'nowrap' }} align={'center'} gap={8}>
      Group by <SSelect onSelect={onChangeGroupName} value={groupName} options={selectOptions} dropdownStyle={{ minWidth: 200 }} size={'small'} />
    </Flex>
  )
}
