import { Form } from 'antd'

import SInputNumber from '@/components/s-input-number'

export interface FilterNumberRangeProps {
  minLabel: string
  maxLabel: string
  unit: string
  value?: [number | undefined, number | undefined]
  onChange?: (value?: FilterNumberRangeProps['value']) => void
}

export default function FilterNumberRange (props: FilterNumberRangeProps) {
  const { minLabel, maxLabel, value, onChange, unit } = props
  return (
    <Form style={{ width: 250 }} layout={'vertical'}>
      <Form.Item style={{ marginBottom: 8 }} label={`${minLabel} (${unit})`}>
        <SInputNumber
          value={value?.[0]}
          onChange={(v) => onChange?.([v, value?.[1]])}
        />
      </Form.Item>
      <Form.Item className={'mb0'} label={`${maxLabel} (${unit})`}>
        <SInputNumber
          value={value?.[1]}
          onChange={(v) => onChange?.([value?.[0], v])}
        />
      </Form.Item>
    </Form>
  )
}
