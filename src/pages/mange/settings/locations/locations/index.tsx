import { useNavigate } from 'react-router-dom'
import { IconChevronRight, IconMapPin } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Empty } from 'antd'

import { LocationListApi, LocationListRes } from '@/api/location/list'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SLocation from '@/components/s-location'
import SRender from '@/components/s-render'

export default function Locations () {
  const nav = useNavigate()
  const list = useRequest(LocationListApi)

  return (
    <Page
      type={'settings'}
      bottom={64}
      header={
        <SRender render={list.data?.length}>
          <Button onClick={() => { nav('/settings/locations/change') }} type={'primary'}>
            Add location
          </Button>
        </SRender>
      }
      title={'Locations'}
      width={800}
    >
      <SCard
        tips={list?.data?.length ? 'Manage the places you sell products, ship orders, and keep inventory.' : ''}
        loading={list.loading}
        title={'All locations'}
      >

        <SRender render={!list.data?.length}>
          <Empty
            image={
              <div style={{ paddingTop: 32 }}>
                <IconMapPin size={64} color={'#ddd'} />
              </div>
            }
            description={(
              <div className={'secondary'}>
                Manage the places you sell products, ship orders, and keep inventory.
              </div>
            )}
            style={{ paddingBottom: 24, marginTop: -32 }}
          >
            <Button onClick={() => { nav('/settings/locations/change') }} type={'primary'}>
              Add location
            </Button>
          </Empty>
        </SRender>
        <SRender render={list.data?.length}>
          <SLocation
            onClick={(item: LocationListRes) => { nav(`/settings/locations/change/${item.id}`) }}
            value={list?.data || []}
            extra={() => <IconChevronRight size={16} />}
          />
        </SRender>
      </SCard>
    </Page>
  )
}
