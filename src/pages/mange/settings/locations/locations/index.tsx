import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('product')

  return (
    <Page
      bottom={64}
      header={
        <SRender render={list.data?.length}>
          <Button onClick={() => { nav('/settings/locations/change') }} type={'primary'}>
            {t('添加位置')}
          </Button>
        </SRender>
      }
      title={t('位置')}
      width={700}
    >
      <SCard
        tips={list?.data?.length ? t('管理您销售商品、发货和存货的地点。') : ''}
        loading={list.loading}
        title={t('所有位置')}
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
                {t('管理您销售商品、发货和存货的地点。')}
              </div>
            )}
            style={{ paddingBottom: 24, marginTop: -32 }}
          >
            <Button onClick={() => { nav('/settings/locations/change') }} type={'primary'}>
              {t('添加位置')}
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
