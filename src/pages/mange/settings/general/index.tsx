import { Plus } from '@icon-park/react'
import { Card, Flex, Form, Input } from 'antd'

import Address from '@/components/address'
import Page from '@/components/page'
import SSelect from '@/components/s-select'

import styles from './index.module.less'

export default function General () {
  return (
    <Page isChange={false} title={'General'} width={700}>
      <Form layout={'vertical'}>
        <Flex vertical gap={16}>
          <Card title={'Profile'}>
            <Flex gap={48}>
              <Flex vertical flex={3}>
                <Form.Item className={'flex1'} label={'Store name'}>
                  <Input />
                </Form.Item>
                <Form.Item extra={'Shopkone uses this to contact you.'} className={'flex1'} label={'Store owner email'}>
                  <Input />
                </Form.Item>
                <Form.Item extra={'This email is used to contact customers.'} label={'Customer service email'}>
                  <Input />
                </Form.Item>
              </Flex>
              <Flex vertical flex={2}>
                <Form.Item
                  label={'Website favicon'}
                >
                  <Flex align={'center'} justify={'center'} className={styles.favicon} >
                    <Plus size={24} style={{ position: 'relative', top: 2 }} />
                  </Flex>
                </Form.Item>
              </Flex>
            </Flex>
          </Card>
          <Card title={'Address'}>
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
