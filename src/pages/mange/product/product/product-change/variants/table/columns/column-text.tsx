import { Input } from 'antd'

export interface ColumnTextProps {
  onChange: (value: string) => void
  value: string
}

export default function ColumnText (props: ColumnTextProps) {
  const { value, onChange } = props
  return (
    <Input
      onChange={e => { onChange(e.target.value) }}
      autoComplete={'off'}
      value={value}
    />
  )
}
