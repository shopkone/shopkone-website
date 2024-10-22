import { useTranslation } from 'react-i18next'
import { Checkbox, Form } from 'antd'

export interface TrackTypeProps {
  value?: boolean
  onChange?: (value: boolean) => void
}

export default function TrackType (props: TrackTypeProps) {
  const { value, onChange } = props
  const form = Form.useFormInstance()
  const { t } = useTranslation('product', { keyPrefix: 'product' })

  const onChangeHandle = (checked: boolean) => {
    if (checked) {
      const policy = form.getFieldValue('inventory_policy')
      if (!policy) {
        form.setFieldValue('inventory_policy', 2) // Assuming 2 corresponds to "Continue selling when out of stock"
      }
    }
    onChange?.(checked)
  }

  return (
    <Checkbox onChange={e => { onChangeHandle(e.target.checked) }} checked={value}>
      <span style={{ position: 'relative', top: -1 }}>{t('跟踪库存')}</span>
    </Checkbox>
  )
}
