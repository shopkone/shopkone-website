import { useTranslation } from 'react-i18next'
import { Flex, Input } from 'antd'

import Page from '@/components/page'
import SCard from '@/components/s-card'

export default function Terms () {
  const { t } = useTranslation('settings', { keyPrefix: 'terms' })
  return (
    <Page width={800} title={t('服务条款')}>
      <Flex vertical gap={16}>
        <SCard title={t('退款条约')}>
          <Input.TextArea />
        </SCard>

        <SCard title={t('隐私政策')}>
          <Input.TextArea />
        </SCard>

        <SCard title={t('服务条约')}>
          <Input.TextArea />
        </SCard>
      </Flex>
    </Page>
  )
}
