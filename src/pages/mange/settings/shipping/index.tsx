import { Suspense, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Button, Flex, TabsProps } from 'antd'

import { useCountries } from '@/api/base/countries'
import { LocationListApi } from '@/api/location/list'
import Page from '@/components/page'
import SLoading from '@/components/s-loading'
import { useShippingState } from '@/pages/mange/settings/shipping/state'

import styles from './index.module.less'

export default function Shipping () {
  const locationList = useRequest(LocationListApi)
  const nav = useNavigate()
  const shippingState = useShippingState()
  const countries = useCountries()
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })

  const tabs: TabsProps['items'] = [
    { label: t('快递发货'), key: '' },
    { label: t('本地配送'), key: 'local-delivery' },
    { label: t('到店自提'), key: 'pickup-in-store' }
  ]

  const onTabClick = (key: string) => {
    nav(`/settings/shipping/${key}`)
  }

  useEffect(() => {
    if (!locationList.data) return
    shippingState.setLocations(locationList.data || [])
  }, [locationList.data])

  return (
    <Page bottom={64} width={700}>
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
    </Page>
  )
}
