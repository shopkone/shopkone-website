import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Flex, Switch } from 'antd'

import { useCountries } from '@/api/base/countries'
import { useCurrencyList } from '@/api/base/currency-list'
import { LocationListApi } from '@/api/location/list'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SLocation from '@/components/s-location'
import SSelect from '@/components/s-select'

export default function LocalChange () {
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const id = Number(useParams().id || 0)
  const locations = useRequest(async () => await LocationListApi({ active: true }))
  const currentLocation = locations.data?.find(item => item.id === id)
  const currencyList = useCurrencyList()
  const countries = useCountries()

  return (
    <Page
      loading={locations.loading || currencyList.loading || countries.loading}
      width={700}
      back={'/settings/shipping/local-delivery'} title={t('编辑本地配送')}
      bottom={64}
    >
      <Flex style={{ minHeight: 400 }} vertical gap={16}>
        <SCard >
          <SLocation
            hideLoading
            hideTag
            borderless
            style={() => ({ padding: 0 })}
            value={currentLocation ? [currentLocation] : []}
            extra={() => <Switch />}
          />
        </SCard>

        <SCard title={t('计费货币')}>
          <SSelect
            listHeight={400}
            showSearch
            optionFilterProp={'label'}
            options={currencyList.data?.map(item => ({ value: item.code, label: item.title }))}
            style={{ width: 'calc(50% - 16px)' }}
          />
        </SCard>

        <SCard title={t('设置配送区域')}>
          asd
        </SCard>
      </Flex>
    </Page>
  )
}
