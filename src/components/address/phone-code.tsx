import { useMemo } from 'react'
import { Flex, Input } from 'antd'

import { useCountries } from '@/api/base/countries'
import { usePhonePrefix } from '@/api/base/phone-prefix'
import { PhoneType } from '@/api/common/address'
import CountryFlag from '@/components/country-flag'
import SSelect from '@/components/s-select'

export interface PhoneCodeProps {
  value?: PhoneType
  onChange?: (value: PhoneType) => void
}

export default function PhoneCode (props: PhoneCodeProps) {
  const { value, onChange } = props

  const phoneCodes = usePhonePrefix()
  const countries = useCountries()

  const options = useMemo(() => {
    if (!phoneCodes.data) return []
    return phoneCodes.data.map(item => {
      const i = countries?.data?.find(c => c.code === item.code)
      const label = i?.name || item.code
      return { label: `${label} (+${item.prefix})`, value: item.code }
    })
  }, [phoneCodes.data, countries.data])

  const onChangePrefix = (code: string) => {
    onChange?.({
      country: code,
      num: value?.num || '',
      prefix: phoneCodes.data?.find(item => item.code === code)?.prefix || 0
    })
  }

  const onChangeNum = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.({
      country: value?.country || '',
      num: e.target.value,
      prefix: value?.prefix || 0
    })
  }

  return (
    <Flex className={'fit-width'}>
      <Flex gap={4} className={'fit-width'}>
        <SSelect
          showSearch
          virtual={false}
          optionFilterProp={'label'}
          value={value?.country}
          loading={phoneCodes.loading || countries.loading}
          dropdownStyle={{ width: 320 }}
          options={options}
          style={{ width: 100 }}
          listHeight={400}
          onChange={onChangePrefix}
          labelRender={({ value, label }) =>
            (
              <div style={{
                position: 'relative',
                top: -1
              }}
              >
                <CountryFlag size={20} country={value?.toString()} />
              </div>
            )}
        />
        <Input
          className={'fit-width'}
          value={value?.num}
          prefix={`(+${value?.prefix || ''})`}
          onChange={onChangeNum}
        />
      </Flex>
    </Flex>
  )
}
