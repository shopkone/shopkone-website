import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Button, Flex, Form, Input, Select } from 'antd'

import { useCurrencyList } from '@/api/base/currency-list'
import { AddressType } from '@/api/common/address'
import { CustomerInfoApi } from '@/api/customer/info'
import { CustomerOptionsApi } from '@/api/customer/options'
import { MarketListApi } from '@/api/market/list'
import { OrderPreCalApi } from '@/api/order/pre-cal-order'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import { useOpen } from '@/hooks/useOpen'
import CustomerBaseInfo from '@/pages/mange/customer/info/customer-base-info'
import AddressRender from '@/pages/mange/order/draft/change/address-render'
import AddressSelect from '@/pages/mange/order/draft/change/address-select'
import Market from '@/pages/mange/order/draft/change/market'
import Payment from '@/pages/mange/order/draft/change/payment'
import Products from '@/pages/mange/order/draft/change/products'

import styles from './index.module.less'

export default function OrderDraftChange () {
  const { t } = useTranslation('orders', { keyPrefix: 'drafts' })
  const [form] = Form.useForm()
  const marketList = useRequest(MarketListApi)
  const country = Form.useWatch('country', form)
  const currencies = useCurrencyList()
  const currency = currencies.data?.find(i => i.code === country?.currency_code)
  const customers = useRequest(CustomerOptionsApi)
  const customerInfo = useRequest(CustomerInfoApi, { manual: true })
  const addressOpen = useOpen<AddressType>()
  const [addressList, setAddressList] = useState<Record<string, AddressType[]>>()
  const preCal = useRequest(OrderPreCalApi, { manual: true })

  const customer_id = Form.useWatch('customer_id', form)
  const address = Form.useWatch('address', form)

  const updateAddressList = (address?: AddressType[], customerId?: number) => {
    if (!address) return
    const newList = (addressList?.[customerId || customer_id] || [])?.map(i => {
      const find = address.find(option => i.id === option.id)
      return find || i
    })
    const list = address?.filter(option => {
      const find = newList.find(i => i.id === option.id)
      return !find
    }) || []
    setAddressList(prev => ({ ...prev, [customerId || customer_id]: [...newList, ...list] }))
  }

  const calPrice = async () => {
    const values = form.getFieldsValue()
    if (!values) return
    const { country, address, variants, customer_id } = values
    if (!variants?.length || !country) return
    await preCal.runAsync({
      variant_items: variants,
      address,
      market_id: 1,
      customer_id
    })
    console.log(variants)
  }

  const onValuesChange = () => {
    calPrice()
  }

  const customerOptions = useMemo(() => {
    if (!customers.data) return []
    return customers.data.map(option => {
      const { email, phone, first_name, last_name } = option
      const name = [first_name, last_name]
      const label = (
        <div style={{ marginBottom: 4 }}>
          <div>{name.join(' ')}</div>
          <div style={{ marginTop: -3 }} className={'tips'}>{phone || email}</div>
        </div>
      )
      return { label, value: option.id }
    })
  }, [customers.data])

  const onChangeCustomerId = (customer_id: number) => {
    if (!customer_id) return
    customerInfo.runAsync({ id: customer_id }).then(res => {
      form.setFieldValue('address', res?.address?.[0])
      updateAddressList(res.address, res.id)
    })
  }

  return (
    <Page
      loadingHiddenBg
      loading={marketList.loading || currencies.loading || customers.loading}
      back={'/orders/drafts'}
      title={t('创建订单')}
      width={950}
    >
      <Form onValuesChange={onValuesChange} layout={'vertical'} form={form}>
        <Flex gap={16}>
          <Flex gap={16} vertical className={'flex1'}>
            <Form.Item className={'mb0'} name={'variants'}>
              <Products currency={currency} />
            </Form.Item>

            <Payment currency={currency} />

          </Flex>

          <Flex vertical gap={16}>
            <SCard
              extra={
                <SRender render={customer_id}>
                  <Button onClick={() => { form.setFieldValue('customer_id', undefined) }} type={'link'} size={'small'}>
                    {t('重新选择')}
                  </Button>
                </SRender>
              }
              title={t('客户')}
              style={{ width: 320 }}
            >
              <SLoading loading={customerInfo.loading}>
                <Form.Item style={{ display: (customerInfo?.data && customer_id) ? 'none' : undefined }} name={'customer_id'}>
                  <SSelect
                    onChange={onChangeCustomerId}
                    options={customerOptions}
                    className={'fit-width'}
                  />
                </Form.Item>
                <div style={{ display: (customerInfo?.data?.id && (customer_id === customerInfo?.params?.[0]?.id)) ? undefined : 'none' }}>
                  <CustomerBaseInfo info={customerInfo?.data} />

                  <Flex className={styles.customerTitle} align={'center'} justify={'space-between'}>
                    <div>{t('收货地址')}</div>
                    <Button
                      onClick={() => { addressOpen.edit(form.getFieldValue('address')) }}
                      style={{ fontWeight: 450, marginRight: -8 }}
                      type={'link'}
                      size={'small'}
                    >
                      {t('编辑地址')}
                    </Button>
                  </Flex>

                  <AddressSelect
                    onFresh={(address) => {
                      updateAddressList(address ? [address] : [])
                    }}
                    openInfo={addressOpen}
                    address={addressList?.[customer_id] || []}
                  />

                  <Form.Item
                    style={{
                      display: address ? undefined : 'none'
                    }}
                    name={'address'}
                    className={'mb0'}
                  >
                    <AddressRender />
                  </Form.Item>

                  <div className={styles.customerTitle}>{t('账单地址')}</div>
                  <div style={{ marginLeft: 4 }}>
                    {t('与收货地址相同')}
                  </div>
                </div>
              </SLoading>
            </SCard>
            <Form.Item className={'mb0'} name={'country'}>
              <Market options={marketList.data || []} />
            </Form.Item>

            <SCard title={t('订单备注')}>
              <Form.Item name={'note'}>
                <Input.TextArea autoSize={{ minRows: 4 }} />
              </Form.Item>
            </SCard>

            <SCard title={t('订单标签')}>
              <Form.Item name={'tags'}>
                <Select
                  className={'fit-width'}
                  placeholder={t('添加标签内容，回车确定')}
                  open={false}
                  mode={'tags'}
                  suffixIcon={null}
                />
              </Form.Item>
            </SCard>
          </Flex>
        </Flex>
      </Form>
    </Page>
  )
}
