import { Checkbox } from 'antd'

export interface TrackTypeProps {
  value?: boolean
  onChange?: (value: boolean) => void
}

export default function TrackType (props: TrackTypeProps) {
  const { value, onChange } = props

  const onChangeHandle = (checked: boolean) => {
    onChange?.(checked)
  }

  return (
    <Checkbox onChange={e => { onChangeHandle(e.target.checked) }} checked={value}>
      <span style={{ position: 'relative', top: -1 }}>Inventory tracking</span>
    </Checkbox>
  )
}
