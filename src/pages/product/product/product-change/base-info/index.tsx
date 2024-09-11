import { Card, Form, Input } from 'antd'

import Media from '@/components/media'

export default function BaseInfo () {
  return (
    <Card bordered>
      <Form.Item label={'Title'}>
        <Input placeholder={'Short sleeve t-shirt'} />
      </Form.Item>
      <Form.Item label={'Description'}>
        <Input.TextArea autoSize={{ minRows: 4, maxRows: 4 }} />
      </Form.Item>
      <Form.Item className={'mb0'} label={'Media'}>
        <Media />
      </Form.Item>
    </Card>
  )
}
