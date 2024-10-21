import { Checkbox, Form } from 'antd'

export interface TrackTypeProps {
  value?: boolean
  onChange?: (value: boolean) => void
}

export default function TrackType (props: TrackTypeProps) {
  const { value, onChange } = props
  const form = Form.useFormInstance()

  const onChangeHandle = (checked: boolean) => {
    if (checked) {
      const policy = form.getFieldValue('inventory_policy')
      if (!policy) {
        form.setFieldValue('inventory_policy', 2)
      }
    }
    onChange?.(checked)
  }

  return (
    <Checkbox onChange={e => { onChangeHandle(e.target.checked) }} checked={value}>
      <span style={{ position: 'relative', top: -1 }}>Inventory tracking</span>
    </Checkbox>
  )
}
