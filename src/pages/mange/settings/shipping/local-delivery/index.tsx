import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'

import { LocalDeliveryListApi } from '@/api/localDelivery/list'
import SCard from '@/components/s-card'
import SLocation from '@/components/s-location'
import SRender from '@/components/s-render'
import Status from '@/components/status'
import { useShippingState } from '@/pages/mange/settings/shipping/state'

export default function LocalDelivery () {
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const locations = useShippingState(state => state.locations)
  const setLoading = useShippingState(state => state.setLoading)
  const nav = useNavigate()
  const list = useRequest(LocalDeliveryListApi)

  const data = list.data?.map(item => locations.find(l => l.id === item.location_id))?.filter(Boolean)

  const toChange = (id: number) => {
    const realId = list.data?.find(item => item.location_id === id)?.id || id
    nav(`change/${realId}`)
  }

  useEffect(() => {
    setLoading(!data?.length)
  }, [data])

  return (
    <div style={{ minHeight: 400 }}>
      <SRender render={!!data?.length}>
        <SCard>
          <SLocation
            hideLoading
            hideTag
            value={data as any || []}
            extra={() => <Status>{t('服务停用')}</Status>}
            onClick={(i) => { toChange(i.id) }}
          />
        </SCard>
      </SRender>
    </div>
  )
}
