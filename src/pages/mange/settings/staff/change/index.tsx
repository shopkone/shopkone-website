import { Card, Checkbox, Flex, Form, Input } from 'antd'

import Page from '@/components/page'

export default function Change () {
  return (
    <Page type={'settings'} back={'/settings/staff'} width={950} title={'Add staff'} isChange={false}>
      <Form layout={'vertical'}>
        <Flex gap={16}>
          <Flex vertical gap={16} flex={1}>
            <Card title={'Staff permissions'} className={'fit-width'}>
              1q23
            </Card>

            <Card title={'App permissions'} className={'fit-width'}>
              <Checkbox>Manage and install all applications</Checkbox>
            </Card>
          </Flex>

          <Flex style={{ width: 350 }}>
            <Card className={'fit-width'} title={'Staff info'}>
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
            </Card>
          </Flex>
        </Flex>
      </Form>
    </Page>
  )
}
