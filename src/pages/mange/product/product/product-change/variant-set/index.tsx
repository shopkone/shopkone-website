import { Form } from 'antd'

import VariantOut from '@/pages/mange/product/product/product-change/variant-set/variant-list/variant-out'
import VariantOptions from '@/pages/mange/product/product/product-change/variant-set/variant-options'

export default function VariantSet () {
  return (
    <div style={{ width: 612 }}>
      <Form.Item name={'product_options'}>
        <VariantOptions />
      </Form.Item>
      <Form.Item className={'mb0'} name={'variants'}>
        <VariantOut />
      </Form.Item>
    </div>
  )
}
