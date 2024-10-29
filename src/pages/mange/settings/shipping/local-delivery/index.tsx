import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import SCard from '@/components/s-card'
import SLocation from '@/components/s-location'
import Status from '@/components/status'
import { useShippingState } from '@/pages/mange/settings/shipping/state'

export default function LocalDelivery () {
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const locations = useShippingState(state => state.locations)
  const nav = useNavigate()

  return (
    <SCard>
      <SLocation
        hideLoading
        hideTag
        value={locations}
        extra={() => <Status>{t('服务停用')}</Status>}
        onClick={(i) => { nav(`change/${i.id}`) }}
      />
    </SCard>
  )
}
