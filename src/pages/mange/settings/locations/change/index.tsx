import { Card, Form, Input } from 'antd'

import Address from '@/components/address'
import Page from '@/components/page'

export default function Change () {
  return (
    <Page back={'/settings/locations'} width={700} title={'Add location'}>
      <Form layout={'vertical'}>
        <Card title={'Name'}>
          <Form.Item className={'mb0'}>
            <Input />
          </Form.Item>
        </Card>
        <Card title={'Address'} style={{ marginTop: 16 }}>
          <Address hasEmail />
        </Card>
      </Form>
    </Page>
  )
}
