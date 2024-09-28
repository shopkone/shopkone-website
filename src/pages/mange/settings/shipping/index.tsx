import { Suspense, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { IconTruckDelivery } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Empty, Tabs, TabsProps } from 'antd'

import { LocationListApi } from '@/api/location/list'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import { useShippingState } from '@/pages/mange/settings/shipping/state'

export default function Shipping () {
  const location = useLocation()
  const locationList = useRequest(LocationListApi)
  const nav = useNavigate()
  const shippingState = useShippingState()

  const tabs: TabsProps['items'] = [
    { label: 'Courier service', key: '' },
    { label: 'Local delivery', key: 'local-delivery' },
    { label: 'Pickup in store', key: 'pickup-in-store' }
  ]

  const onTabClick: TabsProps['onTabClick'] = key => {
    nav(`/settings/shipping/${key}`)
  }

  useEffect(() => {
    if (!locationList.data) return
    shippingState.setLocations(locationList.data || [])
  }, [locationList.data])

  return (
    <Page title={locationList.data?.length ? '' : 'Shipping'} bottom={64} width={700}>
      <SCard loading={locationList.loading}>
        <Empty
          image={
            <div style={{ paddingTop: 32 }}>
              <IconTruckDelivery size={64} color={'#ddd'} />
            </div>
          }
          description={(
            <div className={'secondary'}>
              No available locations at the moment. Please go to the location list Add location or enable locations to set up "Local delivery" and activate the service.
            </div>
          )}
          style={{ paddingBottom: 24, marginTop: -32 }}
        >
          <Button onClick={() => { nav('/settings/locations') }} type={'primary'}>
            To location
          </Button>
        </Empty>
      </SCard>

      <SRender render={!!locationList.data?.length}>
        <div style={{ marginTop: 8 }}>
          <Tabs onTabClick={onTabClick} activeKey={location?.pathname?.split('/')?.[3]} items={tabs} />
        </div>

        <Suspense fallback={<SLoading minHeight={400} />}>
          <Outlet />
        </Suspense>
      </SRender>
    </Page>
  )
}
