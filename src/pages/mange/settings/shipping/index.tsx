import { Suspense, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { IconTruckDelivery } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Empty, Flex, TabsProps } from 'antd'

import { useCountries } from '@/api/base/countries'
import { LocationListApi } from '@/api/location/list'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import { useI18n } from '@/hooks/use-lang'
import { useShippingState } from '@/pages/mange/settings/shipping/state'

import styles from './index.module.less'

export default function Shipping () {
  const locationList = useRequest(LocationListApi)
  const nav = useNavigate()
  const shippingState = useShippingState()
  const countries = useCountries()
  const t = useI18n()

  const tabs: TabsProps['items'] = [
    { label: t('快递服务'), key: '' },
    { label: t('本地配送'), key: 'local-delivery' },
    { label: t('店内自取'), key: 'pickup-in-store' }
  ]

  const onTabClick = (key: string) => {
    nav(`/settings/shipping/${key}`)
  }

  useEffect(() => {
    if (!locationList.data) return
    shippingState.setLocations(locationList.data || [])
  }, [locationList.data])

  return (
    <Page type={'settings'} title={locationList.data?.length ? '' : t('运输')} bottom={64} width={700}>
      <SRender render={!locationList.data?.length && !countries.loading}>
        <SCard loading={locationList.loading}>
          <Empty
            image={
              <div style={{ paddingTop: 32 }}>
                <IconTruckDelivery size={64} color={'#ddd'} />
              </div>
            }
            description={(
              <div className={'secondary'}>
                {t('目前没有可用的地点。请前往地点列表添加地点或启用地点，以设置“本地配送”并激活该服务。')}
              </div>
            )}
            style={{ paddingBottom: 24, marginTop: -32 }}
          >
            <Button onClick={() => { nav('/settings/locations') }} type={'primary'}>
              {t('前往地点')}
            </Button>
          </Empty>
        </SCard>
      </SRender>

      <SRender render={!!locationList.data?.length}>
        <Flex className={styles.tabs}>
          {
            tabs.map(tab => (
              <Button type={'text'} key={tab.key} onClick={() => { onTabClick(tab.key) }}>
                {tab.label}
              </Button>
            ))
          }
        </Flex>

        <Suspense fallback={<SLoading minHeight={400} />}>
          <Outlet />
        </Suspense>
      </SRender>
    </Page>
  )
}
