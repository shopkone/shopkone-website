import { Checkbox, Flex, Form, Input } from 'antd'

import Page from '@/components/page'
import SCard from '@/components/s-card'

export default function Change () {
  return (
    <Page back={'/settings/staff'} width={950} title={'Add staff'} isChange={false}>
      <Form layout={'vertical'}>
        <Flex gap={16}>
          <Flex vertical gap={16} flex={1}>
            <SCard title={'Staff permissions'} className={'fit-width'}>
              1q23
            </SCard>

            <SCard title={'App permissions'} className={'fit-width'}>
              <Checkbox>Manage and install all applications</Checkbox>
            </SCard>
          </Flex>

          <Flex style={{ width: 350 }}>
            <SCard className={'fit-width'} title={'Staff info'}>
              <Form.Item label={'Name'}>
                <Input />
              </Form.Item>
              <Form.Item label={'Account of the invited staff'}>
                <Input />
              </Form.Item>
              <Form.Item label={'Other ways of contact(Optional)'}>
                <Input />
              </Form.Item>
              <Form.Item label={'Remarks'}>
                <Input.TextArea autoSize={{ minRows: 5 }} />
              </Form.Item>
            </SCard>
          </Flex>
        </Flex>
      </Form>
    </Page>
  )
}
