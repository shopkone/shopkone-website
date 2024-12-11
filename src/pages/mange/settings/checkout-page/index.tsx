import { useTranslation } from 'react-i18next'
import { Flex } from 'antd'

import Page from '@/components/page'
import SCard from '@/components/s-card'

export default function CheckoutPage () {
  const { t } = useTranslation('settings', { keyPrefix: 'checkout_page' })
  return (
    <Page width={750} title={t('结账页设置')}>
      <Flex vertical gap={16}>

        <SCard>
          asd
        </SCard>

        <SCard>
          asd
        </SCard>

        <SCard>
          asd
        </SCard>

        <SCard>
          asd
        </SCard>
      </Flex>
    </Page>
  )
}
