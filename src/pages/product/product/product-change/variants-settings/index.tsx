import { Card, Checkbox, Form, Radio } from 'antd'

import styles from './index.module.less'

export default function VariantsSettings () {
  const options = [
    { label: 'Single Variant', value: 1 },
    { label: 'Multiple variants', value: 2 }
  ]

  const tackOptions = [
    { label: 'Stop selling when out of stock', value: 1 },
    { label: 'Continue selling when out of stock', value: 2 },
    { label: 'Set as draft when out of stock', value: 3 }
  ]

  return (
    <Card title={'Variants Settings'}>
      <Form.Item>
        <Radio.Group options={options} />
      </Form.Item>

      <Form.Item style={{ marginTop: -8 }}>
        <Checkbox>Inventory tracking</Checkbox>
      </Form.Item>
      <Form.Item style={{ marginBottom: 0, marginTop: -12 }}>
        <Radio.Group className={styles.group} options={tackOptions} />
      </Form.Item>
    </Card>
  )
}
