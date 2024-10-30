import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Flex, Form, Switch } from 'antd'

import { useCountries } from '@/api/base/countries'
import { InStorePickUpInfoApi } from '@/api/in-store-pickup/info'
import { LocationListApi } from '@/api/location/list'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SLocation from '@/components/s-location'

export default function Change () {
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const id = Number(useParams().id)
  const info = useRequest(InStorePickUpInfoApi, { manual: true })
  const locations = useRequest(async () => await LocationListApi({ active: true }))
  const countries = useCountries()
  const currentLocation = locations.data?.find(item => info?.data?.location_id === item.id)

  useEffect(() => {
    if (!id) return
    info.run({ id })
  }, [id])

  return (
    <Page
      loading={locations.loading || countries.loading || info.loading}
      title={t('编辑到店自提')}
      width={700}
      back={'/settings/shipping/pickup-in-store'}
    >
      <Flex gap={16} vertical>
        <SCard >
          <SLocation
            hideLoading
            hideTag
            borderless
            style={() => ({ padding: 0 })}
            value={currentLocation ? [currentLocation] : []}
            extra={() => (
              <Form.Item className={'mb0'} name={'status'} valuePropName={'checked'}>
                <Switch />
              </Form.Item>
            )}
          />
        </SCard>

        <SCard title={t('服务设置')}>
          asd
        </SCard>
      </Flex>
    </Page>
  )
}
