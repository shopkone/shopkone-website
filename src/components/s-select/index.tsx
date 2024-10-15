import { useState } from 'react'
import { IconChevronDown, IconSearch } from '@tabler/icons-react'
import { Select, SelectProps } from 'antd'

import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'

export default function SSelect (props: SelectProps) {
  const [focus, setFocus] = useState(false)

  return (
    <Select
      onDropdownVisibleChange={visible => { !visible && setFocus(false) }}
      onClick={e => { !focus && setFocus(true) }}
      suffixIcon={
        <>
          <SRender render={!props.loading}>
            {
            (focus && props.showSearch)
              ? <IconSearch size={15} color={'#646a73c0'} />
              : (
                <IconChevronDown size={15} color={'#646a73c0'} />
                )
            }
          </SRender>
          <SRender style={{ marginLeft: 8 }} render={props.loading}>
            <SLoading black size={14} />
          </SRender>
        </>
      }
      {...props}
      virtual={false}
      labelRender={(props.showSearch && focus) ? props.value : props.labelRender}
    />
  )
}
