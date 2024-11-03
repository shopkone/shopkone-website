import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconChevronRight } from '@tabler/icons-react'
import { useMemoizedFn } from 'ahooks'
import { Checkbox, Flex } from 'antd'

import { CountriesRes, useCountries } from '@/api/base/countries'
import IconButton from '@/components/icon-button'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import CountryItem from '@/components/select-country/country-item'

interface CountryTree {
  code: string
  name: string
  children: CountriesRes[]
}

export interface SelectCountryProps {
  onChange?: (value: string[]) => void
  value?: string[]
  height: number
  disabled?: string[]
  onlyCountry?: boolean
}

export default function SelectCountry (props: SelectCountryProps) {
  const { height, disabled, onlyCountry, onChange, value } = props
  const countries = useCountries()
  const { t } = useTranslation('common', { keyPrefix: 'selectCountry' })
  const [expands, setExpands] = useState<string[]>([])

  const continents = useMemo(() => {
    if (!countries.data) return []
    const list: CountryTree[] = [
      { code: 'Europe', name: t('欧洲'), children: [] },
      { code: 'Asia', name: t('亚洲'), children: [] },
      { code: 'Africa', name: t('非洲'), children: [] },
      { code: 'North America', name: t('北美洲'), children: [] },
      { code: 'South America', name: t('南美洲'), children: [] },
      { code: 'Oceania', name: t('大洋洲'), children: [] }
    ]
    return list.map((item) => {
      item.children = countries?.data?.filter(country => country.continent === item.code) || []
      return item
    })
  }, [countries.data])

  const onExpand = useMemoizedFn((code: string) => {
    if (expands.includes(code)) {
      setExpands(expands.filter(item => item !== code))
    } else {
      setExpands([...expands, code])
    }
  })

  console.log(continents)

  return (
    <SLoading loading={countries.loading}>
      <Flex vertical style={{ height }}>
        <Flex gap={8} style={{ overflowY: 'auto', flex: 1 }} vertical>
          {
            continents?.map(continent => (
              <div style={{ userSelect: 'none' }} key={continent.code}>
                <Flex align={'center'} gap={8}>
                  <IconButton onClick={() => { onExpand(continent.code) }} size={20} type={'text'}>
                    <IconChevronRight size={15} />
                  </IconButton>
                  <Checkbox>{continent.name}</Checkbox>
                </Flex>
                <SRender render={expands.includes(continent.code)}>
                  <Flex style={{ marginTop: 8 }} gap={8} vertical>
                    {
                      continent.children.map(country => (
                        <CountryItem country={country} key={country.code} />
                      ))
                    }
                  </Flex>
                </SRender>
              </div>
            ))
          }
        </Flex>
      </Flex>
    </SLoading>
  )
}
