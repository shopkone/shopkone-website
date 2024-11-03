import {  DatePicker, Flex, Form, Input, Radio } from 'antd'

import Page from '@/components/page'
import SInputNumber from '@/components/s-input-number'
import SSelect from '@/components/s-select'

import styles from './index.module.less'
import SCard from '@/components/s-card'

export default function Change () {
  const expirationDateOptions = [
    { label: 'No expiration date', value: 'no' },
    { label: 'Set expiration date', value: 'set' }
  ]

  return (
    <Page back={'/products/gift_cards'} title={'Create gift card'} width={950}>
      <Form layout={'vertical'}>
        <Flex gap={16}>
          <Flex flex={1} vertical gap={16}>
            <SCard  title={'Gift card details'}>
              <Form.Item label={'Gift card code'}>
                <Input />
              </Form.Item>
              <Form.Item className={'mb0'} label={'Initial value'}>
                <SInputNumber />
              </Form.Item>
            </SCard>
            <SCard  title={'Expiration date'}>
              <Flex vertical gap={16} style={{ marginTop: 8 }}>
                <div className={'tips'}>
                  Countries have different laws for gift card expiry dates. Check the laws for your country before
                  changing
                  this date.
                </div>

                <Form.Item className={'mb0'}>
                  <Radio.Group className={styles.radio} options={expirationDateOptions} />
                </Form.Item>

                <Form.Item className={'mb0'} label={'Expires on'}>
                  <DatePicker className={'fit-width'} />
                </Form.Item>
              </Flex>
            </SCard>
          </Flex>

          <Flex style={{ width: 300 }} vertical gap={16}>
            <SCard  title={'Issued customer'}>
              <SSelect className={'fit-width'} />
            </SCard>
            <SCard  title={'Notes'}>
              <div className={'tips'} style={{ marginBottom: 12 }}>
                These notes are private and won't be shared with the customer.
              </div>
              <Input.TextArea style={{ marginBottom: 16 }} maxLength={5000} showCount autoSize={{ minRows: 4 }} />
            </SCard>
          </Flex>
        </Flex>
      </Form>
    </Page>
  )
}
