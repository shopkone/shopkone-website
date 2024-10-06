import { Card, Form, Input } from 'antd'

export default function BaseInfo () {
  return (
    <Card style={{ width: 612, flex: 1 }} bordered>
      <div>
        <Form.Item name={'title'} label={'Title'}>
          <Input autoComplete={'off'} placeholder={'My Store gift card'} />
        </Form.Item>
        <Form.Item name={'description'} label={'Description'}>
          <Input.TextArea autoSize={{ minRows: 4, maxRows: 4 }} />
        </Form.Item>
        <Form.Item className={'mb0'} label={'Media'} name={'file_ids'}>
          asd
        </Form.Item>
      </div>
    </Card>
  )
}
