import { useTranslation } from 'react-i18next'

import { MarketListRes } from '@/api/market/list'
import SModal from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'

export interface SelectMarketProps {
  openInfo: UseOpenType<string>
  options: MarketListRes[]
}

export default function SelectMarket (props: SelectMarketProps) {
  const { openInfo, options } = props
  const { t } = useTranslation('orders', { keyPrefix: 'drafts' })

  return (
    <SModal
      title={t('更换市场')}
      open={openInfo.open}
      onCancel={openInfo.close}
    >
      <div style={{ padding: 20 }}>
        {
          options?.map(item => (
            <div key={item.name}>
              asd
            </div>
          ))
        }
      </div>
    </SModal>
  )
}
