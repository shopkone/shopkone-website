import { useState } from 'react'
import { IconChevronDown, IconSearch } from '@tabler/icons-react'
import { Select, SelectProps } from 'antd'

export default function SSelect (props: SelectProps) {
  const [focus, setFocus] = useState(false)

  return (
    <Select
      onDropdownVisibleChange={visible => { !visible && setFocus(false) }}
      onClick={e => { !focus && setFocus(true) }}
      suffixIcon={
        (focus && props.showSearch)
          ? <IconSearch size={15} color={'#646a73c0'} />
          : (
            <IconChevronDown size={15} color={'#646a73c0'} />
            )
      }
      {...props}
      virtual={false}
      labelRender={(props.showSearch && focus) ? props.value : props.labelRender}
    />
  )
}
