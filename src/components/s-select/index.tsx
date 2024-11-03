import { useState } from 'react'
import { IconChevronDown, IconSearch, IconX } from '@tabler/icons-react'
import { Select, SelectProps } from 'antd'

import IconButton from '@/components/icon-button'
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
      removeIcon={(
        <div style={{ position: 'relative', left: -8, top: -6, background: '#fdfdfd', width: 20 }}>
          <IconButton size={20} type={'text'}>
            <IconX color={'#333'} size={14} />
          </IconButton>
        </div>
      )}
      clearIcon={(
        <div style={{ position: 'relative', left: -8, top: -6, background: '#fdfdfd', width: 20 }}>
          <IconButton size={20} type={'text'}>
            <IconX color={'#333'} size={14} />
          </IconButton>
        </div>
      )}
      {...props}
      virtual={false}
      labelRender={(props.showSearch && focus) ? props.value : props.labelRender}
    />
  )
}
