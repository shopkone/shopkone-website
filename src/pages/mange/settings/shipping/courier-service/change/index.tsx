import { Card, Flex, Form, Input } from 'antd'

import Page from '@/components/page'
import SLocation from '@/components/s-location'

export default function Change () {
  return (
    <Page back={'/settings/shipping'} width={700} title={'Create shipping profile'}>
      <Flex gap={16} vertical>
        <Card title={'Profile name'}>
          <Form.Item className={'mb0'} extra={'Customers won’t see this'}>
            <Input />
          </Form.Item>
        </Card>
        <Card title={'Products'}>asd</Card>
        <Card title={'Fulfillment locations'}>
          <SLocation />
        </Card>
        <Card title={'Shipping zones'}>asd</Card>
      </Flex>
    </Page>
  )
}
