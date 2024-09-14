import { useEffect } from 'react'
import { Flex, Select } from 'antd'
import { useAtom } from 'jotai'

import { variantsOptions } from '@/pages/product/product/product-change/state'

export interface GroupProps {
  onChange: (groupName: string) => void
  value?: string
}

export default function Group (props: GroupProps) {
  const { value: groupName, onChange: setGroupName } = props
  const [options] = useAtom(variantsOptions)

  useEffect(() => {
    if (options.length <= 1) return
    if (!groupName) {
      setGroupName(options[0]?.name)
    }
  }, [options])

  if (options.length <= 1 || !groupName) {
    return null
  }

  return (
    <Flex align={'center'}>
      <div style={{ color: '#646a73', fontSize: 12, minWidth: 60 }}>Group by</div>
      <Select
        dropdownStyle={{ minWidth: 150 }}
        options={options?.map(i => ({ label: i, value: i }))}
        style={{ minWidth: 100 }}
        size={'small'}
        value={groupName}
        onChange={setGroupName}
      />
    </Flex>
  )
}
