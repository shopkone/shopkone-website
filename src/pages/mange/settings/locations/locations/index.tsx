import { useNavigate } from 'react-router-dom'
import { Button, Card, Flex } from 'antd'

import Page from '@/components/page'
import SLocation from '@/components/s-location'

export default function Locations () {
  const nav = useNavigate()
  return (
    <Page
      header={
        <Flex>
          <Button onClick={() => { nav('/settings/locations/change') }} type={'primary'}>
            Add location
          </Button>
        </Flex>
      }
      title={'Locations'}
      width={800}
    >
      <Card title={'All locations'}>
        <div style={{ marginBottom: 12, marginTop: -4 }} className={'tips'}>
          Manage the places you sell products, ship orders, and keep inventory.
        </div>
        <SLocation />
      </Card>
    </Page>
  )
}
