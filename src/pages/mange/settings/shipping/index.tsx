import { Suspense } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Tabs, TabsProps } from 'antd'

import Page from '@/components/page'
import SLoading from '@/components/s-loading'

export default function Shipping () {
  const location = useLocation()
  const nav = useNavigate()

  const tabs: TabsProps['items'] = [
    { label: 'Courier service', key: '' },
    { label: 'Local delivery', key: 'local-delivery' },
    { label: 'Pickup in store', key: 'pickup-in-store' }
  ]

  const onTabClick: TabsProps['onTabClick'] = key => {
    nav(`/settings/shipping/${key}`)
  }

  return (
    <Page bottom={64} width={700}>
      <div style={{ marginTop: 8 }}>
        <Tabs onTabClick={onTabClick} activeKey={location?.pathname?.split('/')?.[3]} items={tabs} />
      </div>

      <Suspense fallback={<SLoading minHeight={400} />}>
        <Outlet />
      </Suspense>
    </Page>
  )
}
