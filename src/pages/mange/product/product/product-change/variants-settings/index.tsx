import { useTranslation } from 'react-i18next'
import { Form, Radio } from 'antd'

import SCard from '@/components/s-card'
import { useInventoryPolicyOptions } from '@/constant/product'
import TrackType from '@/pages/mange/product/product/product-change/variants-settings/track-type'
import TypeChanger from '@/pages/mange/product/product/product-change/variants-settings/type-changer'

import styles from './index.module.less'

export default function VariantsSettings () {
  const { t } = useTranslation('product', { keyPrefix: 'product' })
  const tackOptions = useInventoryPolicyOptions(t)

  const form = Form.useFormInstance()
  const inventoryTracking = Form.useWatch('inventory_tracking', form)

  return (
    <SCard
      className={styles.container}
      style={{ height: inventoryTracking ? 230 : 135 }}
      title={t('款式设置')}
    >
      <div>
        <Form.Item name={'variant_type'}>
          <TypeChanger />
        </Form.Item>

        <Form.Item
          name={'inventory_tracking'}
          style={{ marginTop: -8 }}
        >
          <TrackType />
        </Form.Item>
        {
          inventoryTracking
            ? (
              <Form.Item
                name={'inventory_policy'}
                style={{
                  marginBottom: 0,
                  marginTop: -12
                }}
              >
                <Radio.Group className={styles.group} options={tackOptions} />
              </Form.Item>
              )
            : null
        }
      </div>
    </SCard>
  )
}
