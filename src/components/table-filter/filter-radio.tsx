import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { Flex, Radio, RadioGroupProps, Typography } from 'antd'
import isEqual from 'lodash/isEqual'

import FilterBase from '@/components/table-filter/filter-base'

import styles from './index.module.less'

export interface RadioGroup extends Omit<RadioGroupProps, 'options' | 'onChange' | 'value'> {
  options: Array<{ label: string, value: string | number }>
  onChange?: (value: string | number | undefined) => void
  value?: string | number
  children: React.ReactNode
  onLabelChange?: (label?: ReactNode) => void
}

export default function FilterRadio (props: RadioGroup) {
  const { options, onChange, value, children, onLabelChange, ...rest } = props
  const [open, setOpen] = useState(false)
  const [tempValue, setTempValue] = useState<RadioGroupProps['value']>()
  const init = useRef(false)

  const changeHandle: RadioGroupProps['onChange'] = (e) => {
    setTempValue?.(e.target.value)
  }

  const onClear = () => {
    if (!value) return
    init.current = false
    setOpen(false)
    onChange?.(undefined)
  }

  const optionList = options.map(item => ({
    label: (
      <Typography.Text style={{ maxWidth: 600 }} ellipsis={{ tooltip: true }}>
        {item.label}
      </Typography.Text>
    ),
    value: item.value
  }))

  const label = useMemo(() => {
    return options?.find((item) => {
      return item?.value === value
    })?.label || ''
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
    onChange?.(tempValue)
    setTempValue(undefined)
  }, [open])

  useEffect(() => {
    if (isEqual(value, tempValue)) return
    setTempValue(value)
  }, [value])

  useEffect(() => {
    const l = (
      <Flex gap={4} align={'center'}>
        {children}
        <span style={{ fontWeight: 600 }}>: {label} </span>
      </Flex>
    )
    onLabelChange?.(label ? l : undefined)
  }, [label])

  return (
    <FilterBase showLabel={label} onClear={label ? onClear : undefined} open={open} setOpen={setOpen} label={children}>
      <Radio.Group
        {...rest}
        className={styles.radio}
        value={tempValue}
        onChange={changeHandle}
        options={optionList}
      />
    </FilterBase>
  )
}
