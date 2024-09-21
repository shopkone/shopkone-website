import { Tabs, TabsProps } from 'antd'

import Page from '@/components/page'
import CourierService from '@/pages/mange/settings/shipping/courier-service'

export default function Shipping () {
  const tabs: TabsProps['items'] = [
    { label: 'Courier service', key: 'courier_service' },
    { label: 'Local delivery', key: 'local_delivery' },
    { label: 'Local pickup', key: 'local_pickup' }
  ]

  return (
    <Page bottom={64} width={700}>
      <div style={{ marginTop: 8 }}>
        <Tabs items={tabs} />
      </div>

      <CourierService />
    </Page>
  )
}
