import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { Form } from 'antd'
import isEqual from 'lodash/isEqual'

import SInputNumber from '@/components/s-input-number'
import FilterBase from '@/components/table-filter/filter-base'

export interface FilterNumberRangeProps {
  minLabel: string
  maxLabel: string
  unit: string
  prefix?: boolean
  value?: { max?: number, min?: number }
  onChange: (value?: FilterNumberRangeProps['value']) => void
  onLabelChange?: (label?: string) => void
  children: React.ReactNode
}

const FilterNumberRange = (props: FilterNumberRangeProps) => {
  const { children, maxLabel, minLabel, unit, onChange, value, onLabelChange, prefix } = props
  const [open, setOpen] = useState(false)
  const [tempValue, setTempValue] = useState<FilterNumberRangeProps['value']>()
  const init = useRef(false)

  const onClear = () => {
    if (!value) return
    setTempValue(undefined)
    setOpen(false)
  }

  const onChangeHandle = (v: FilterNumberRangeProps['value']) => {
    setTempValue(v)
  }

  const label = useMemo(() => {
    const min = value?.min
    const max = value?.max
    if (min && !max) return `Greater than ${min} ${unit}`
    if (max && !min) return `Less than ${max} ${unit}`
    if (min && max) return `${min} ${unit}-${max} ${unit}`
    return ''
  }, [value])

  useEffect(() => {
    if (open) return
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
    onLabelChange?.(label ? `${children}: ${label}` : undefined)
  }, [label])

  return (
    <FilterBase open={open} setOpen={setOpen} label={children} onClear={label ? onClear : undefined}>
      <Form style={{ width: 250 }} layout={'vertical'}>
        <Form.Item style={{ marginBottom: 8 }} label={`${minLabel}`}>
          <SInputNumber
            value={tempValue?.min}
            onChange={(v) => { onChangeHandle?.({ min: v, max: tempValue?.max }) }}
            suffix={prefix ? undefined : unit}
            prefix={prefix ? unit : undefined}
          />
        </Form.Item>
        <Form.Item className={'mb0'} label={`${maxLabel}`}>
          <SInputNumber
            value={tempValue?.max}
            onChange={(v) => { onChangeHandle?.({ min: tempValue?.min, max: v }) }}
            suffix={prefix ? undefined : unit}
            prefix={prefix ? unit : undefined}
          />
        </Form.Item>
      </Form>
    </FilterBase>
  )
}

export default memo(FilterNumberRange)

/*
import { Form } from 'antd'

import SInputNumber from '@/components/s-input-number'

export interface FilterNumberRangeProps {
  minLabel: string
  maxLabel: string
  unit: string
  value?: { max?: number, min?: number }
  onChange?: (value?: FilterNumberRangeProps['value']) => void
}

export default function FilterNumberRange (props: FilterNumberRangeProps) {
  const { minLabel, maxLabel, value, onChange, unit } = props

  return (
    <Form style={{ width: 250 }} layout={'vertical'}>
      <Form.Item style={{ marginBottom: 8 }} label={`${minLabel}`}>
        <SInputNumber
          value={value?.min}
          onChange={(v) => { onChange?.({ min: v, max: value?.max }) }}
          suffix={unit}
        />
      </Form.Item>
      <Form.Item className={'mb0'} label={`${maxLabel}`}>
        <SInputNumber
          value={value?.max}
          onChange={(v) => { onChange?.({ min: value?.min, max: v }) }}
          suffix={unit}
        />
      </Form.Item>
    </Form>
  )
}
*/
