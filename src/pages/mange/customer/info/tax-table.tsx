import { useTranslation } from 'react-i18next'
import { BaseTableProps } from 'ali-react-table'

import { useCountries } from '@/api/base/countries'
import { TaxFeeItem } from '@/api/customer/info'
import SSelect from '@/components/s-select'
import STable from '@/components/s-table'

export interface TaxTableProps {
  value?: TaxFeeItem[]
  onChange?: (value: TaxFeeItem[]) => void
}

export default function TaxTable (props: TaxTableProps) {
  const { value, onChange } = props
  const { t } = useTranslation('customers', { keyPrefix: 'info' })
  const countries = useCountries()

  const columns: BaseTableProps['columns'] = [
    {
      title: t('国家/地区'),
      code: 'country_code',
      name: 'country_code',
      lock: true,
      width: 300,
      render: (countryCode: string) => {
        return (
          <SSelect
            value={countryCode}
            options={countries.data?.map(item => ({ label: item.name, value: item.code }))}
          />
        )
      }
    },
    {
      title: t('州/省(可多选)'),
      code: 'zones',
      name: 'zones',
      render: (zones: string[]) => (
        <SSelect
          options={countries.data?.map(item => ({ label: item.name, value: item.code }))}
        />
      )
    }
  ]

  console.log({ value })

  return (
    <STable
      init={!!countries.data}
      borderless
      className={'table-border'}
      columns={columns}
      data={value || []}
    />
  )
}
