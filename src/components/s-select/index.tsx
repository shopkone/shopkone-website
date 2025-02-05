import { useState } from 'react'
import { IconChevronDown, IconSearch, IconX } from '@tabler/icons-react'
import { Select, SelectProps } from 'antd'

import IconButton from '@/components/icon-button'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'

import styles from './index.module.less'

export interface SSelectProps extends Omit<SelectProps, 'allowClear'> {
  allowClear?: boolean
}

export default function SSelect (props: SSelectProps) {
  const { allowClear, ...rest } = props
  const [focus, setFocus] = useState(false)

  return (
    <Select
      onDropdownVisibleChange={visible => { !visible && setFocus(false) }}
      onFocus={(e) => { setFocus(true) }}
      onBlur={(e) => { setFocus(false) }}
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
        props.mode !== undefined
          ? undefined
          : (
            <div className={styles.clearIcon}>
              <IconButton size={14} type={'text'}>
                <IconX color={'#333'} size={13} />
              </IconButton>
            </div>
            )
      )}
      allowClear={allowClear
        ? {
            clearIcon: (
              <div className={styles.clearIcon}>
                <IconButton size={14} type={'link'}>
                  <IconX color={'#333'} size={13} />
                </IconButton>
              </div>
            )
          }
        : undefined}
      {...rest}
      virtual={false}
      labelRender={(props.showSearch && focus) ? props.value : props.labelRender}
    />
  )
}
