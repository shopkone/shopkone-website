import { useEffect } from 'react'
import { Flex, Select } from 'antd'

import { Options } from '@/pages/product/product/product-change/variants/variant-changer'

export interface GroupProps {
  onChange: (groupName?: string) => void
  value?: string
  hide?: boolean
  options: Options[]
}

export default function Group (props: GroupProps) {
  const { value: groupName, onChange: setGroupName, hide, options } = props

  useEffect(() => {
    if ((options?.length || 0) <= 1) {
      setGroupName()
      return
    }
    const find = options?.find(i => i.name === groupName)
    if (!find) {
      setGroupName(options?.[0]?.name)
    }
  }, [options])

  if ((options?.length || 0) <= 1 || !groupName || hide) {
    return null
  }

  return (
    <Flex align={'center'}>
      <div style={{
        color: '#646a73',
        fontSize: 12,
        minWidth: 60,
        position: 'relative',
        top: 1
      }}
      >Group by
      </div>
      <Select
        dropdownStyle={{ minWidth: 150 }}
        options={options?.map(i => ({
          label: i.name,
          value: i.name
        }))}
        style={{ minWidth: 100 }}
        size={'small'}
        value={groupName}
        onChange={setGroupName}
      />
      <div>
        <div style={{ paddingLeft: 12, opacity: 0.2 }}>|</div>
      </div>
    </Flex>
  )
}
