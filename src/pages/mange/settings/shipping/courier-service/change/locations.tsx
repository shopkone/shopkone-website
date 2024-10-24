import { useTranslation } from 'react-i18next'
import { IconMapPin } from '@tabler/icons-react'
import { Button, Card, Empty } from 'antd'

import { LocationListRes } from '@/api/location/list'
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

  return (
    <Card
      extra={
        <Button type={'link'} size={'small'} onClick={() => { openInfo.edit(value) }}>
          {t('选择地点')}
        </Button>
      }
      title={t('发货地点')}
    >
      <SRender render={!value?.length}>
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

      <SRender render={value?.length}>
        <SLocation hideTag value={locations.filter(item => value.includes(item.id))} />
      </SRender>

      <LocationModal openInfo={openInfo} locations={locations} onConfirm={onChange} />

    </Card>
  )
}
