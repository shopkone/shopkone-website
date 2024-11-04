import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconSearch } from '@tabler/icons-react'
import { useDebounceFn, useMemoizedFn } from 'ahooks'
import { Input, Tree, TreeDataNode } from 'antd'

import { CountriesRes, useCountries, ZoneListOut } from '@/api/base/countries'
import SLoading from '@/components/s-loading'

import styles from './index.module.less'
// @ts-expect-error
import Handle from './search-handle?worker'

export interface SelectCountryProps {
  onChange?: (value: string[]) => void
  value?: string[]
  height: number
  disabled?: string[]
  onlyCountry?: boolean
}

export default function SelectCountry (props: SelectCountryProps) {
  const { onChange, value = [], height, disabled, onlyCountry } = props
  const countries = useCountries()
  const { t } = useTranslation('common', { keyPrefix: 'selectCountry' })
  const [searchKey, setSearchKey] = useState('')
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])
  const workerRef = useRef<Worker>()
  const [filteredTree, setFilteredTree] = useState<TreeDataNode[]>([])

  const getZones = useMemoizedFn((zone: ZoneListOut, countryCode: string) => {
    const { code, name } = zone
    const realCode = `${countryCode}_____${code}`
    return { key: realCode, title: name, children: [], isLeaf: true, disabled: disabled?.includes(realCode) }
  })

  const getCountry = useMemoizedFn((country: CountriesRes): TreeDataNode => {
    const { code, name, zones } = country
    const zoneList = zones.map(zone => getZones(zone, country.code))
    const d = zones?.length ? zoneList.every(zone => zone.disabled) : disabled?.includes(code)
    return { key: code, title: name, children: onlyCountry ? [] : zoneList, disabled: d }
  })

  const tree: TreeDataNode[] = useMemo(() => {
    if (!countries.data) return []
    let continents: TreeDataNode[] = [
      { key: 'Europe', title: t('欧洲'), children: [] },
      { key: 'Asia', title: t('亚洲'), children: [] },
      { key: 'Africa', title: t('非洲'), children: [] },
      { key: 'North America', title: t('北美洲'), children: [] },
      { key: 'South America', title: t('南美洲'), children: [] },
      { key: 'Oceania', title: t('大洋洲'), children: [] }
    ]
    continents = continents.map(continent => {
      const children = countries?.data?.filter(i => i.continent === continent.key).map(country => getCountry(country))
      const d = children?.every(country => country.disabled)
      return { ...continent, children, disabled: d }
    })
    return continents
  }, [countries.data, disabled, value, onlyCountry])

  const onFilter = useDebounceFn(() => {
    workerRef?.current?.postMessage({ searchKey, tree })
  }, { wait: 300 }).run

  useEffect(() => {
    workerRef.current = new Handle()
    if (!workerRef.current) return
    workerRef.current.onmessage = (e: MessageEvent) => {
      const { tree, expands } = e.data
      setExpandedKeys(expands)
      setFilteredTree(tree)
    }
    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  useEffect(() => {
    onFilter()
  }, [searchKey])

  return (
    <SLoading loading={countries.loading || (!filteredTree?.length && !searchKey)}>
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
        <div className={styles.tree} style={{ height }}>
          <Tree
            filterTreeNode={node => {
              if (!searchKey) return false
              if (typeof node.title !== 'string') return false
              return node.title.toUpperCase().includes(searchKey.toUpperCase())
            }}
            expandedKeys={expandedKeys}
            onExpand={setExpandedKeys as any}
            blockNode
            multiple
            checkedKeys={value}
            selectable={false}
            checkable
            onCheck={(v, info) => {
              const ret = (v as string[]).filter(i => {
                return !info.checkedNodes.find(ii => ii.key === i)?.children?.length
              })
              onChange?.(ret)
            }}
            treeData={filteredTree}
          />
        </div>
      </div>
    </SLoading>
  )
}
