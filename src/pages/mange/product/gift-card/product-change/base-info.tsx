import {  Form, Input } from 'antd'
import SCard from '@/components/s-card'

export default function BaseInfo () {
  return (
    <SCard  style={{ width: 612, flex: 1 }} bordered>
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
    </SCard>
  )
}
