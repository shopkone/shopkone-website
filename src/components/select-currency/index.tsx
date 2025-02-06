import { useMemo } from 'react'

import { useCurrencyList } from '@/api/base/currency-list'
import SSelect, { SSelectProps } from '@/components/s-select'

export interface SelectCurrencyProps extends SSelectProps {}

export default function SelectCurrency (props: SelectCurrencyProps) {
  const currencyList = useCurrencyList()
  const options = useMemo(() => {
    return currencyList.data?.map(item => {
      const lastStr = item.title.substring(item.title.length - 1, item.title.length)
      const title = item.title.slice(0, item.title.length - 1)
      return { value: item.code, label: title + ` ${item.symbol}` + lastStr }
    })
  }, [currencyList])

  return (
    <SSelect
      {...props}
      loading={currencyList.loading}
      listHeight={400}
      showSearch
      optionFilterProp={'label'}
      options={options}
    />
  )
}
