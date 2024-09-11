import { Radio, RadioGroupProps } from 'antd'

export interface RadioGroup extends Omit<RadioGroupProps, 'options' | 'onChange' | 'value'> {
  options: Array<{ label: string, value: string | number }>
  onChange?: (value: string | number | undefined) => void
  value?: string | number
}

export default function FilterRadio (props: RadioGroup) {
  const { options, onChange, value, ...rest } = props
  const changeHandle: RadioGroupProps['onChange'] = (e) => {
    onChange?.(e.target.value)
  }

  return <Radio.Group {...rest} value={value} onChange={changeHandle} options={options} />
}
