import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input, TreeSelect } from 'antd'

import { CountriesRes, useCountries } from '@/api/base/countries'
import SLoading from '@/components/s-loading'

import styles from './index.module.less'

interface CountryTree {
  code: string
  name: string
  children: CountriesRes[]
}

export interface SelectCountryProps {
  onChange?: (value: string[]) => void
  value?: string[]
  height: number
}

export default function SelectCountry (props: SelectCountryProps) {
  const { onChange, value = [], height } = props
  const countries = useCountries()
  const [tree, setTree] = useState<CountryTree[]>([])
  const { t } = useTranslation('settings', { keyPrefix: 'selectCountry' })
  const containerRef = useRef<HTMLDivElement>(null)
  const [searchKey, setSearchKey] = useState('')

  useEffect(() => {
    if (!countries.data || tree?.length) return
    const continent: CountryTree[] = [
      { code: 'Europe', name: t('xx'), children: [] },
      { code: 'Asia', name: t('xx'), children: [] },
      { code: 'Africa', name: t('xx'), children: [] },
      { code: 'North America', name: t('xx'), children: [] },
      { code: 'South America', name: t('xx'), children: [] },
      { code: 'Oceania', name: t('xx'), children: [] }
    ]
    countries.data.forEach((country) => {
      const continentIndex = continent.findIndex(item => item.code === country.continent)
      if (continentIndex !== -1) {
        continent[continentIndex].children.push(country)
      }
    })
    setTree(continent)
  }, [countries.data])

  return (
    <SLoading loading={countries.loading}>
      <div className={styles.container}>
        <div style={{ padding: '0 12px' }}>
          <Input
            placeholder={t('搜索国家/地区')}
            allowClear
            value={searchKey}
            onChange={e => { setSearchKey(e.target.value) }}
          />
        </div>
        <div ref={containerRef}>
          {
            containerRef?.current
              ? (
                <TreeSelect
                  value={value}
                  onChange={onChange}
                  searchValue={searchKey}
                  getPopupContainer={() => containerRef.current as any}
                  variant={'borderless'}
                  className={styles.select}
                  virtual={false}
                  listItemHeight={32}
                  popupClassName={styles.tree}
                  treeCheckable
                  showSearch
                  treeNodeFilterProp={'name'}
                  listHeight={height}
                  open
                  fieldNames={{
                    label: 'name',
                    value: 'code'
                  }}
                  dropdownStyle={{
                    width: 560,
                    height
                  }}
                  treeData={tree}
                />
                )
              : null
          }
        </div>
      </div>
    </SLoading>
  )
}
