import { Card, Form, Input, Select } from 'antd'

import SSelect from '@/components/s-select'
import SelectCategory from '@/pages/mange/product/product/product-change/product-organization/select-category'

export default function ProductOrganization () {
  return (
    <Card title={'Product organization'}>
      <Form.Item name={'category'} label={'Category'}>
        <SelectCategory />
      </Form.Item>
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
