import { useTranslation } from 'react-i18next'
import { Form } from 'antd'

import Page from '@/components/page'
import SCard from '@/components/s-card'
import MarketsEdit from '@/pages/mange/settings/markets/change/markets-edit'

export default function MarketAdd () {
  const { t } = useTranslation('settings', { keyPrefix: 'market' })
  const [form] = Form.useForm()

  return (
    <Page
      bottom={0}
      autoHeight
      width={600}
      title={t('添加市场')}
      back={'/settings/markets'}
    >
      <SCard>
        <MarketsEdit form={form} />
      </SCard>
    </Page>
  )
}
