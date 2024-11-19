import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Button, Flex } from 'antd'

import { useCountries } from '@/api/base/countries'
import { useCurrencyList } from '@/api/base/currency-list'
import { MarketListRes } from '@/api/market/list'
import { MarketPriceInfoApi } from '@/api/market/market-price-info'
import { OrderCountry } from '@/api/order/create-order'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import { useOpen } from '@/hooks/useOpen'
import SelectMarket from '@/pages/mange/order/draft/change/select-market'

export interface MarketProps {
  options: MarketListRes[]
  value?: OrderCountry
  onChange?: (value: OrderCountry) => void
}

export default function Market (props: MarketProps) {
  const { options, value, onChange } = props
  const marketPriceAdjust = useRequest(MarketPriceInfoApi, { manual: true })
  const currencies = useCurrencyList()
  const { t } = useTranslation('orders', { keyPrefix: 'drafts' })
  const marketOpen = useOpen<string>()
  const currency = useMemo(() => {
    return currencies.data?.find(item => item.code === marketPriceAdjust?.data?.currency_code)
  }, [currencies.data, marketPriceAdjust?.data?.currency_code])
  const market = useMemo(() => {
    if (!value || !options?.length) return null
    return options.find(item => item.country_codes?.includes(value?.country_code))
  }, [value, options])
  const countries = useCountries()
  const countryName = countries?.data?.find(item => item.code === value?.country_code)?.name

  useEffect(() => {
    if (!value?.country_code && options.length && !marketPriceAdjust.loading) {
      const mainMarket = options.find(item => item.is_main)
      const firstCountryCode = mainMarket?.country_codes?.[0]
      if (firstCountryCode) {
        onChange?.({ country_code: firstCountryCode, currency_code: currency?.code || '' })
        marketPriceAdjust.run({ market_id: mainMarket?.id })
      }
    } else if (value?.country_code && !marketPriceAdjust?.loading && options.length) {
      const currentMarket = options.find(item => item.country_codes?.includes(value?.country_code))
      if (currentMarket) {
        marketPriceAdjust.run({ market_id: currentMarket?.id })
      }
    }
  }, [value?.country_code, options])

  useEffect(() => {
    if (!currency) return
    onChange?.({ country_code: value?.country_code || '', currency_code: currency?.code })
  }, [currency])

  return (
    <SCard
      extra={
        <SRender render={options.length > 1}>
          <Button
            onClick={() => { marketOpen.edit(value?.country_code) }}
            type={'link'}
            size={'small'}
          >
            {t('更换市场')}
          </Button>
        </SRender>
      }
      loading={marketPriceAdjust.loading || currencies.loading || countries.loading}
      title={t('市场')}
      style={{ width: 320 }}
    >
      <div style={{ marginTop: 4 }}>{market?.name || '-'}</div>
      <Flex gap={8} style={{ marginTop: 8 }}>
        <SRender render={countryName !== market?.name}>
          {countryName}
          <div>-</div>
        </SRender>
        <div>{currency?.title || '-'}</div>
      </Flex>

      <SelectMarket
        onConfirm={(country_code) => {
          onChange?.({ country_code, currency_code: currency?.code || '' })
        }}
        selectedCountry={value?.country_code || ''}
        options={options}
        openInfo={marketOpen}
      />
    </SCard>
  )
}
