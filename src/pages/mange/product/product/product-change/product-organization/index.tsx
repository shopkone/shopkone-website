import { Card, Checkbox, Form, Input, Select } from 'antd'

import SSelect from '@/components/s-select'
import SelectCategory from '@/pages/mange/product/product/product-change/product-organization/select-category'

import styles from './index.module.less'

export default function ProductOrganization () {
  return (
    <Card title={'Product organization'}>
      <Form.Item
        name={'requires_shipping'}
        valuePropName={'checked'}
        style={{ marginBottom: 8 }}
      >
        <Checkbox>Requires shipping</Checkbox>
      </Form.Item>
      <Form.Item
        name={'charge_tax_on_this_product'}
        valuePropName={'checked'}
      >
        <Checkbox>Charge tax on this product</Checkbox>
      </Form.Item>
      <div className={styles.line} />
      <Form.Item name={'category'} label={'Category'}>
        <SelectCategory />
      </Form.Item>
      <div className={styles.line} />
      <Form.Item name={'spu'} label={'Spu'}>
        <Input autoComplete={'off'} />
      </Form.Item>
      <Form.Item name={'vendor'} label={'Vendor'}>
        <Input autoComplete={'off'} />
      </Form.Item>
      <Form.Item name={'collections'} label={'Collections'}>
        <SSelect />
      </Form.Item>
      <Form.Item name={'tags'} className={'mb0'} label={'Tags'}>
        <Select
          open={false}
          mode={'tags'}
          suffixIcon={null}
        />
      </Form.Item>
    </Card>
  )
}
