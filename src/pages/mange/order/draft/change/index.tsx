import { useTranslation } from 'react-i18next'
import { Flex, Form } from 'antd'

import Page from '@/components/page'
import SCard from '@/components/s-card'
import Products from '@/pages/mange/order/draft/change/products'

export default function OrderDraftChange () {
  const { t } = useTranslation('orders', { keyPrefix: 'drafts' })
  const [form] = Form.useForm()

  return (
    <Page back={'/orders/drafts'} title={t('创建订单')} width={950}>
      <Form form={form}>
        <Flex gap={16}>
          <Flex gap={16} vertical className={'flex1'}>
            <Form.Item className={'mb0'} name={'variants'}>
              <Products />
            </Form.Item>

            <SCard title={t('收款')}>
              asd
            </SCard>
          </Flex>

          <Flex vertical gap={16}>
            <SCard title={t('客户')} style={{ width: 320 }}>
              asd
            </SCard>
          </Flex>
        </Flex>
      </Form>
    </Page>
  )
}
