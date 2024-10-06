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
          onChange={(v) => onChange?.({ min: v, max: value?.max })}
          suffix={unit}
        />
      </Form.Item>
      <Form.Item className={'mb0'} label={`${maxLabel}`}>
        <SInputNumber
          value={value?.max}
          onChange={(v) => onChange?.({ min: value?.min, max: v })}
          suffix={unit}
        />
      </Form.Item>
    </Form>
  )
}
