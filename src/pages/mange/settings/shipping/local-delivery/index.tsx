import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconChevronRight } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Flex } from 'antd'

import { LocalDeliveryListApi } from '@/api/localDelivery/list'
import { LocalDeliveryStatus } from '@/api/localDelivery/update'
import SLocation from '@/components/s-location'
import Status from '@/components/status'
import { useShippingState } from '@/pages/mange/settings/shipping/state'

import styles from './index.module.less'

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
      <div style={{ background: '#fff', borderRadius: 16 }}>
        <SLocation
          hideLoading
          hideTag
          value={data as any || []}
          renderTitle={(node, item) => (
            <Flex align={'center'} gap={8}>
              {node}
              {
                list?.data?.find(i => i.location_id === item.id)?.status === LocalDeliveryStatus.Open
                  ? <Status type={'success'}>{t('服务启用')}</Status>
                  : <Status >{t('服务停用')}</Status>
              }
            </Flex>
          )}
          extra={() => <IconChevronRight style={{ marginRight: 8 }} size={16} />}
          onClick={(i) => { toChange(i.id) }}
          className={styles.locationItem}
        />
      </div>
    </div>
  )
}
