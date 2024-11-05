import { useTranslation } from 'react-i18next'
import { Form } from 'antd'

import { MarketInfoRes } from '@/api/market/info'
import SModal from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'
import MarketsEdit from '@/pages/mange/settings/markets/change/markets-edit'

export interface MarketEditModalProps {
  openInfo: UseOpenType<MarketInfoRes>
}

export default function MarketEditModal (props: MarketEditModalProps) {
  const { openInfo } = props
  const [form] = Form.useForm()
  const { t } = useTranslation('settings', { keyPrefix: 'market' })

  return (
    <SModal
      onCancel={openInfo.close}
      title={t('编辑市场')}
      width={600}
      open={openInfo.open}
    >
      <div style={{ padding: 16 }}>
        <MarketsEdit form={form} height={420} noClassName />
      </div>
    </SModal>
  )
}
