import { Card, Form, Input } from 'antd'

export default function ProductOrganization () {
  return (
    <Card title={'Product organization'}>
      <Form.Item label={'Product type'}>
        <Input />
      </Form.Item>
      <Form.Item label={'Vendor'}>
        <Input />
      </Form.Item>
      <Form.Item label={'Collections'}>
        <Input />
      </Form.Item>
      <Form.Item className={'mb0'} label={'Tags'}>
        <Input />
      </Form.Item>
    </Card>
  )
}
