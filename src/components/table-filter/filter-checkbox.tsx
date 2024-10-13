import { useEffect, useMemo, useRef, useState } from 'react'
import { Checkbox, Typography } from 'antd'
import { CheckboxGroupProps } from 'antd/es/checkbox'
import isEqual from 'lodash/isEqual'

import FilterBase from '@/components/table-filter/filter-base'

import styles from './index.module.less'

export interface CheckboxGroup extends Omit<CheckboxGroupProps, 'options'> {
  options: Array<{ label: string, value: string | number }>
  children: React.ReactNode
  onLabelChange?: (label?: string) => void
}

export default function FilterCheckbox (props: CheckboxGroup) {
  const { options, onChange, value, children, onLabelChange, ...rest } = props
  const [open, setOpen] = useState(false)
  const [tempValue, setTempValue] = useState<CheckboxGroup['value']>()
  const init = useRef(false)

  const changeHandle: CheckboxGroupProps['onChange'] = (e) => {
    setTempValue?.(e)
  }

  const onClear = () => {
    if (!value) return
    init.current = false
    setOpen(false)
    onChange?.([])
  }

  const optionList = options.map(item => ({
    label: (
      <Typography.Text style={{ maxWidth: 130, position: 'relative', top: -1 }} ellipsis={{ tooltip: true }}>
        {item.label}
      </Typography.Text>
    ),
    value: item.value
  }))

  const label = useMemo(() => {
    return value?.map((key) => options?.find((item) => {
      return item?.value === key
    })?.label).join(', ')
  }, [value])

  useEffect(() => {
    if (open) {
      init.current = true
      return
    }
    if (!init.current) {
      init.current = true
      return
    }
    if (isEqual(value, tempValue)) return
    onChange?.(tempValue || [])
    setTempValue(undefined)
  }, [open])

  useEffect(() => {
    if (isEqual(value, tempValue)) return
    setTempValue(value)
  }, [value])

  useEffect(() => {
    onLabelChange?.(label ? `${children}: ${label}` : undefined)
  }, [label])

  return (
    <FilterBase showLabel={label} onClear={label ? onClear : undefined} open={open} setOpen={setOpen} label={children}>
      <Checkbox.Group
        {...rest}
        className={styles.radio}
        value={tempValue}
        onChange={changeHandle}
        options={optionList}
      />
    </FilterBase>
  )
}
