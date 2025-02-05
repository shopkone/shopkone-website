import { useTranslation } from 'react-i18next'
import { Checkbox, Form, Radio } from 'antd'

import { useInventoryPolicyOptions } from '@/constant/product'
import styles from '@/pages/mange/product/product/product-change/other-settings/index.module.less'

export interface TrackTypeProps {
  value?: boolean
  onChange?: (value: boolean) => void
}

export default function TrackType (props: TrackTypeProps) {
  const { value, onChange } = props
  const form = Form.useFormInstance()
  const { t } = useTranslation('product', { keyPrefix: 'product' })
  const inventoryTracking = Form.useWatch('inventory_tracking', form)
  const tackOptions = useInventoryPolicyOptions(t)

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
    <div className={styles.inner}>
      <Checkbox onChange={e => { onChangeHandle(e.target.checked) }} checked={value}>
        <span style={{ position: 'relative', top: -1 }}>{t('跟踪库存')}</span>
      </Checkbox>
      {
        inventoryTracking
          ? (
            <Form.Item name={'inventory_policy'} style={{ marginBottom: 0, marginTop: 12 }}>
              <Radio.Group className={styles.group} options={tackOptions} />
            </Form.Item>
            )
          : null
      }
    </div>
  )
}
