import { Card, Flex, Form, Input } from 'antd'

import Address from '@/components/address'
import Page from '@/components/page'
import SSelect from '@/components/s-select'

export default function General () {
  return (
    <Page isChange={false} title={'General'} width={700}>
      <Form layout={'vertical'}>
        <Flex vertical gap={16}>
          <Card title={'Profile'}>
            <div className={'tips'} style={{ marginBottom: 12, marginTop: -8 }}>
              These details could be publicly available. Do not use your personal information.
            </div>
            <Flex gap={16}>
              <Flex vertical flex={1}>
                <Form.Item extra={'Appears on your website'} className={'flex1'} label={'Store name'}>
                  <Input />
                </Form.Item>
                <Form.Item className={'flex1'} label={'Store phone'}>
                  <Input />
                </Form.Item>
                <Form.Item extra={'Receives messages about your store.'} label={'Store email'}>
                  <Input />
                </Form.Item>
              </Flex>
              <Flex flex={1}>
                <Form.Item label={'Website favicon'}>
                  123
                </Form.Item>
              </Flex>

            </Flex>
          </Card>
          <Card title={'Billing information'}>
            <Address hasName />
          </Card>
          <Card title={'Store defaults'}>
            <Flex vertical>
              <Form.Item extra={'Changing the currency after the store is in normal operation will affect its product prices, orders, data and other information, please proceed with caution.'} label={'Store currency'}>
                <SSelect style={{ width: 'calc(50% - 16px)' }} />
              </Form.Item>
              <Flex flex={1} gap={16}>
                <Form.Item className={'flex1'} label={'Currency formatting'}>
                  <SSelect />
                </Form.Item>
                <Form.Item className={'flex1'} label={'Time zone'}>
                  <SSelect />
                </Form.Item>
              </Flex>
            </Flex>
          </Card>
          <Card title={'Order ID'}>
            <div className={'tips'} style={{ marginTop: -4, marginBottom: 12 }}>
              Shown on the order page, customer pages, and customer order notifications to identify order
            </div>
            <Form.Item label={'Prefix'}>
              <Input />
            </Form.Item>
            <Form.Item label={'Suffix'}>
              <Input />
            </Form.Item>
            <div>Your order ID will appear as #1001, #1002, #1003 ...</div>
          </Card>
          <Card title={'Password protection'}>
            <div className={'tips'} style={{ marginTop: -8, marginBottom: 12 }}>
              Once you enable the password protection, only customers authorized with password can visit your store.
            </div>
            <Form.Item label={'Password'}>
              <Input style={{ width: 400 }} />
            </Form.Item>
            <Form.Item label={'Message for your visitors'}>
              <Input.TextArea
                placeholder={'This store is password protected. Use the password to enter the store'}
                autoSize={{ minRows: 5 }}
                style={{ width: 400 }}
              />
            </Form.Item>
          </Card>
        </Flex>
      </Form>
    </Page>
  )
}
