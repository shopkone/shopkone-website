import { useTranslation } from 'react-i18next'
import { IconMapPin } from '@tabler/icons-react'
import { Button, Empty } from 'antd'

import { LocationListRes } from '@/api/location/list'
import { ShippingType } from '@/api/shipping/base'
import SCard from '@/components/s-card'
import SLocation from '@/components/s-location'
import SRender from '@/components/s-render'
import { useOpen } from '@/hooks/useOpen'
import LocationModal from '@/pages/mange/settings/shipping/courier-service/change/location-modal'

export interface LocationsProps {
  onChange?: (value: number[]) => void
  value?: number[]
  locations: LocationListRes[]
}

export default function Locations (props: LocationsProps) {
  const { onChange, value = [], locations } = props
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const openInfo = useOpen<number[]>([])
  const type: ShippingType = Number(new URLSearchParams(window.location.search).get('type') || 0)

  return (
    <SCard
      extra={
        <SRender render={value?.length}>
          <Button type={'link'} size={'small'} onClick={() => { openInfo.edit(value) }}>
            {t('选择地点')}
          </Button>
        </SRender>
      }
      title={t('发货地点')}
    >
      <SRender render={!value?.length && type === ShippingType.CustomerExpressDelivery}>
        <Empty
          image={<IconMapPin size={64} color={'#eee'} />}
          description={t('暂无数据')}
          style={{ paddingBottom: 24, overflowY: 'auto' }}
        >
          <Button onClick={() => { openInfo.edit(value) }}>
            {t('选择地点')}
          </Button>
        </Empty>
      </SRender>

      <SRender render={value?.length || type === ShippingType.GeneralExpressDelivery}>
        <SRender render={type !== ShippingType.CustomerExpressDelivery} className={'tips'} style={{ marginBottom: 6 }}>
          {t('后续新增的地点将会被自动添加为发货地点')}
        </SRender>
        <SLocation
          hideTag value={
          type === ShippingType.CustomerExpressDelivery
            ? locations.filter(item => value.includes(item.id))
            : locations
        }
        />
      </SRender>

      <LocationModal openInfo={openInfo} locations={locations} onConfirm={onChange} />

    </SCard>
  )
}
