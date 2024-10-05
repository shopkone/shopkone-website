import { Card, Form, Input } from 'antd'

import Media from '@/components/media'

export default function BaseInfo () {
  return (
    <Card style={{ width: 612, flex: 1 }} bordered>
      <div>
        <Form.Item rules={[{ required: true, message: 'Please enter the title' }]} name={'title'} label={'Title'}>
          <Input autoComplete={'off'} placeholder={'Short sleeve t-shirt'} />
        </Form.Item>
        <Form.Item name={'description'} label={'Description'}>
          <Input.TextArea autoSize={{ minRows: 4, maxRows: 4 }} />
        </Form.Item>
        <Form.Item className={'mb0'} label={'Media'} name={'file_ids'}>
          <Media />
        </Form.Item>
      </div>
    </Card>
  )
}
