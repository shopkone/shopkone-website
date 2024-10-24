import { useTranslation } from 'react-i18next'
import { IconWorld } from '@tabler/icons-react'
import { Button, Card, Empty } from 'antd'

import { BaseShippingZone } from '@/api/shipping/base'
import SRender from '@/components/s-render'
import { useOpen } from '@/hooks/useOpen'
import ZoneModal from '@/pages/mange/settings/shipping/courier-service/change/zone-modal'

export interface ZonesProps {
  value?: BaseShippingZone[]
  onChange?: (value: BaseShippingZone[]) => void
}

export default function Zones (props: ZonesProps) {
  const { onChange, value = [] } = props
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const openInfo = useOpen<BaseShippingZone>()

  const onCreateZone = (item: BaseShippingZone) => {
    onChange?.([...value, item])
  }

  return (
    <Card
      extra={
        <Button type={'link'} size={'small'} onClick={() => { openInfo.edit() }}>
          {t('添加区域')}
        </Button>
      }
      title={t('收货地点')}
    >
      <SRender render={!value.length}>
        <Empty
          image={<IconWorld size={64} color={'#eee'} />}
          description={t('暂无数据')}
          style={{ paddingBottom: 24 }}
        >
          <Button onClick={() => { openInfo.edit() }}>
            {t('添加区域')}
          </Button>
        </Empty>
      </SRender>

      <ZoneModal confirm={onCreateZone} openInfo={openInfo} />
    </Card>
  )
}
