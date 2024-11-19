import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Flex, Form } from 'antd'

import { useCurrencyList } from '@/api/base/currency-list'
import { MarketListApi } from '@/api/market/list'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import Market from '@/pages/mange/order/draft/change/market'
import Products from '@/pages/mange/order/draft/change/products'

export default function OrderDraftChange () {
  const { t } = useTranslation('orders', { keyPrefix: 'drafts' })
  const [form] = Form.useForm()
  const marketList = useRequest(MarketListApi)
  const country = Form.useWatch('country', form)
  const currencies = useCurrencyList()
  const currency = currencies.data?.find(i => i.code === country?.currency_code)

  return (
    <Page
      loadingHiddenBg
      loading={marketList.loading || currencies.loading}
      back={'/orders/drafts'}
      title={t('创建订单')}
      width={950}
    >
      <Form form={form}>
        <Flex gap={16}>
          <Flex gap={16} vertical className={'flex1'}>
            <Form.Item className={'mb0'} name={'variants'}>
              <Products currency={currency} />
            </Form.Item>

            <SCard title={t('收款')}>
              asd
            </SCard>
          </Flex>

          <Flex vertical gap={16}>
            <SCard title={t('客户')} style={{ width: 320 }}>
              asd
            </SCard>
            <Form.Item className={'mb0'} name={'country'}>
              <Market options={marketList.data || []} />
            </Form.Item>
          </Flex>
        </Flex>
      </Form>
    </Page>
  )
}
