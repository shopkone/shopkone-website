import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconSearch } from '@tabler/icons-react'
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
  const { t } = useTranslation('common', { keyPrefix: 'selectCountry' })
  const containerRef = useRef<HTMLDivElement>(null)
  const [searchKey, setSearchKey] = useState('')

  useEffect(() => {
    if (!countries.data || tree?.length) return
    const continent: CountryTree[] = [
      { code: 'Europe', name: t('欧洲'), children: [] },
      { code: 'Asia', name: t('亚洲'), children: [] },
      { code: 'Africa', name: t('非洲'), children: [] },
      { code: 'North America', name: t('北美洲'), children: [] },
      { code: 'South America', name: t('南美洲'), children: [] },
      { code: 'Oceania', name: t('大洋洲'), children: [] }
    ]
    countries.data.forEach((country) => {
      const continentIndex = continent.findIndex(item => item.code === country.continent)
      if (continentIndex !== -1) {
        const children = country.zones.map(zone => ({ ...zone, children: [], code: country.code + '_____' + zone.code }))
        continent[continentIndex].children.push({ ...country, children, zones: [] } as any)
      }
    })
    setTree(continent)
  }, [countries.data])

  return (
    <SLoading loading={countries.loading}>
      <div className={styles.container}>
        <div style={{ padding: '0 12px' }}>
          <Input
            prefix={<IconSearch size={14} style={{ position: 'relative', top: 1 }} />}
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
