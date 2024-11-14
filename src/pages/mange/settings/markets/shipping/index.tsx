import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'

import { MarketInfoApi } from '@/api/market/info'
import { ShippingZoneListApi } from '@/api/shipping/list-by-contry-codes'
import Page from '@/components/page'
import Zones from '@/pages/mange/settings/shipping/courier-service/change/zones'

export default function MarketShipping () {
  const { t } = useTranslation('settings', { keyPrefix: 'market' })
  const id = Number(useParams().id || 0)
  const info = useRequest(MarketInfoApi, { manual: true })
  const list = useRequest(ShippingZoneListApi, { manual: true })

  useEffect(() => {
    if (!id) return
    info.runAsync({ id }).then(res => {
      list.run({ country_codes: res.country_codes })
    })
  }, [id])

  return (
    <Page
      back={`/settings/markets/change/${id}`}
      width={800}
      title={t('发货')}
      loading={info.loading || list.loading}
    >
      <Zones title={t('美国')} value={list.data?.zones} />
    </Page>
  )
}
