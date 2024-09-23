import { useEffect } from 'react'
import { Plus } from '@icon-park/react'
import { useRequest } from 'ahooks'
import { Checkbox, Flex, Form, Input } from 'antd'

import { useCurrencyList } from '@/api/base/currency-list'
import { useTimezoneList } from '@/api/base/timezone-list'
import { ShopGeneralApi } from '@/api/shop/get-general'
import Address from '@/components/address'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SSelect from '@/components/s-select'

import styles from './index.module.less'

export default function General () {
  const general = useRequest(ShopGeneralApi)
  const [form] = Form.useForm()
  const timezones = useTimezoneList()
  const currencyList = useCurrencyList()

  const orderIdPrefix = Form.useWatch('order_id_prefix', form)
  const orderIdSuffix = Form.useWatch('order_id_suffix', form)

  const formattingOptions = [
    { label: 'e.g 123,456.78', value: '123,456.78' },
    { label: 'e.g 123,456', value: '123,456' },
    { label: 'e.g 123.456,78', value: '123.456,78' },
    { label: 'e.g 123.456', value: '123.456' },
    { label: 'e.g 123\'456.65', value: '123\'456.65' }
  ]

  useEffect(() => {
    if (!general.data) return
    const { address, ...rest } = general.data
    form.setFieldsValue({ ...rest, ...address })
  }, [general.data])

  return (
    <Page isChange={false} title={'General'} width={700}>
      <Form form={form} layout={'vertical'}>
        <Flex vertical gap={16}>
          <SCard loading={general.loading} title={'Profile'}>
            <Flex gap={48}>
              <Flex vertical flex={3}>
                <Form.Item name={'store_name'} className={'flex1'} label={'Store name'}>
                  <Input autoComplete={'off'} />
                </Form.Item>
                <Form.Item name={'store_owner_email'} extra={'Shopkone uses this to contact you.'} className={'flex1'} label={'Store owner email'}>
                  <Input autoComplete={'off'} />
                </Form.Item>
                <Form.Item name={'customer_service_email'} extra={'This email is used to contact customers.'} label={'Customer service email'}>
                  <Input autoComplete={'off'} />
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
          </SCard>
          <Address loading={general.loading} hasName />
          <SCard loading={general.loading || timezones.loading || currencyList.loading} title={'Store defaults'}>
            <Flex vertical>
              <Form.Item
                name={'store_currency'}
                extra={'Changing the currency after the store is in normal operation will affect its product prices, orders, data and other information, please proceed with caution.'} label={'Store currency'}
              >
                <SSelect
                  virtual={false}
                  showSearch
                  optionFilterProp={'title'}
                  options={currencyList.data}
                  fieldNames={{ value: 'code', label: 'title' }}
                  style={{ width: 'calc(50% - 16px)' }}
                />
              </Form.Item>
              <Flex flex={1} gap={16}>
                <Form.Item style={{ flexShrink: 0 }} name={'currency_formatting'} className={'flex1'} label={'Currency formatting'}>
                  <SSelect options={formattingOptions} />
                </Form.Item>
                <Form.Item style={{ flexShrink: 0 }} className={'flex1'} name={'timezone'} label={'Time zone'}>
                  <SSelect
                    showSearch
                    optionFilterProp={'description'}
                    options={timezones.data}
                    fieldNames={{ label: 'description', value: 'olson_name' }}
                  />
                </Form.Item>
              </Flex>
            </Flex>
          </SCard>
          <SCard loading={general.loading} title={'Order ID'}>
            <div className={'tips'} style={{ marginTop: -4, marginBottom: 12 }}>
              Shown on the order page, customer pages, and customer order notifications to identify order
            </div>
            <Form.Item name={'order_id_prefix'} label={'Prefix'}>
              <Input autoComplete={'off'} />
            </Form.Item>
            <Form.Item name={'order_id_suffix'} label={'Suffix'}>
              <Input autoComplete={'off'} />
            </Form.Item>
            <div>Your order ID will appear as {orderIdPrefix}1001{orderIdSuffix}, {orderIdPrefix}1002{orderIdSuffix}, {orderIdPrefix}1003{orderIdSuffix} ...</div>
          </SCard>
          <SCard loading={general.loading} title={'Password protection'}>
            <div className={'tips'} style={{ marginTop: -8, marginBottom: 12 }}>
              Once you enable the password protection, only customers authorized with password can visit your store.
            </div>
            <Form.Item valuePropName={'checked'} name={'password_protection'} style={{ marginBottom: 8, fontWeight: 500 }}>
              <Checkbox>Active</Checkbox>
            </Form.Item>
            <Form.Item name={'password'} label={'Password'}>
              <Input style={{ width: 400 }} />
            </Form.Item>
            <Form.Item name={'password_message'} label={'Message for your visitors'}>
              <Input.TextArea
                placeholder={'This store is password protected. Use the password to enter the store'}
                autoSize={{ minRows: 5 }}
                style={{ width: 400 }}
              />
            </Form.Item>
          </SCard>
        </Flex>
      </Form>
    </Page>
  )
}
