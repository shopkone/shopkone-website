import { Card, Checkbox, Form, Radio } from 'antd'

import { useInventoryPolicyOptions } from '@/constant/product'
import TypeChanger from '@/pages/mange/product/product/product-change/variants-settings/type-changer'

import styles from './index.module.less'

export default function VariantsSettings () {
  const tackOptions = useInventoryPolicyOptions()

  const form = Form.useFormInstance()
  const inventoryTracking = Form.useWatch('inventory_tracking', form)

  return (
    <Card
      className={styles.container}
      style={{ height: inventoryTracking ? 230 : 135 }}
      title={'Variants Settings'}
    >
      <div>
        <Form.Item name={'variant_type'}>
          <TypeChanger />
        </Form.Item>

        <Form.Item
          name={'inventory_tracking'}
          valuePropName={'checked'}
          style={{ marginTop: -8 }}
        >
          <Checkbox>Inventory tracking</Checkbox>
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
    </Card>
  )
}
