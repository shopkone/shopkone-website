import { ReactNode, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconArrowsSort, IconFilter, IconMenu2, IconSearch } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Flex, Input, Segmented } from 'antd'

import { CollectionOptionsApi } from '@/api/collection/options'
import IconButton from '@/components/icon-button'
import SSelect from '@/components/s-select'
import FilterCheckbox from '@/components/table-filter/filter-checkbox'
import FilterNumberRange, { FilterNumberRangeProps } from '@/components/table-filter/filter-number-range'
import FilterLabels from '@/components/table-filter/FilterLabels'
import { VariantStatus } from '@/constant/product'
import { useManageState } from '@/pages/mange/state'

import styles from './index.module.less'

interface ValueType {
  status: VariantStatus | 0
  type: string
  keyword: string
  collections: number[]
  price_range: FilterNumberRangeProps['value']
}

export interface FiltersProps {
  value?: ValueType
  onChange?: (value: FiltersProps['value']) => void
}

export default function Filters (props: FiltersProps) {
  const { onChange, value } = props
  const [labels, setLabels] = useState<Record<string, ReactNode>>({})
  const { t } = useTranslation('product', { keyPrefix: 'product' })
  const collections = useRequest(CollectionOptionsApi)
  const shopInfo = useManageState(state => state.shopInfo)

  const onChangeHandle = (field: keyof ValueType, v: ValueType[keyof ValueType]) => {
    onChange?.({ ...value, [field]: v } as any)
  }

  const keywords = useMemo(() => ([
    { label: t('商品标题'), value: 'title' },
    { label: t('商品SPU'), value: 'spu' },
    { label: t('商品标签'), value: 'tag' },
    { label: t('变体名称'), value: 'variant_name' },
    { label: t('SKU'), value: 'variant_sku' }
  ]), [t])

  const statusOptions = useMemo(() => ([
    { label: t('全部'), value: 0 },
    { label: t('已发布'), value: VariantStatus.Published },
    { label: t('草稿'), value: VariantStatus.Draft }
  ]), [t])

  return (
    <div>
      <Flex className={styles.filter} align={'center'} justify={'space-between'}>
        <Flex align={'center'} gap={20}>
          <Segmented
            className={styles.segmented}
            onChange={(v) => { onChangeHandle('status', v as any) }}
            options={statusOptions}
          />
          <div className={styles.line} />
          <Flex className={styles.compact} align={'center'} gap={0}>
            <SSelect
              onChange={(value) => { onChangeHandle('type', value) }}
              value={value?.type}
              dropdownStyle={{ minWidth: 200 }}
              style={{ minWidth: 100 }}
              options={keywords}
              size={'small'}
            />
            <Input
              allowClear
              value={value?.keyword}
              onChange={(value) => {
                onChangeHandle('keyword', value?.target.value)
              }}
              style={{ width: 200 }}
              size={'small'}
              placeholder={t('搜索商品')}
              prefix={<IconSearch size={15} className={styles['filter-icon']} />}
            />
          </Flex>

          <FilterCheckbox
            options={collections?.data || []}
            onChange={(v) => {
              onChangeHandle('collections', v)
            }}
            value={value?.collections}
            onLabelChange={(l) => { setLabels({ ...labels, collections: l }) }}
          >
            {t('筛选系列')}
          </FilterCheckbox>

          <FilterNumberRange
            maxLabel={t('最低价')}
            minLabel={t('最高价')}
            unit={shopInfo?.store_currency || ''}
            onChange={(v) => { onChangeHandle('price_range', v) }}
            onLabelChange={(price_range) => { setLabels({ ...labels, price_range }) }}
            value={value?.price_range || {}}
          >
            {t('售价区间')}
          </FilterNumberRange>
        </Flex>

        <Flex className={styles.actions} gap={12}>
          <IconButton size={26}>
            <IconFilter strokeWidth={2.5} size={14} />
          </IconButton>
          <IconButton size={26}>
            <IconMenu2 strokeWidth={2.5} size={14} />
          </IconButton>
          <IconButton size={26}>
            <IconArrowsSort strokeWidth={2.1} size={14} />
          </IconButton>
        </Flex>
      </Flex>

      <FilterLabels
        style={{ margin: 12 }}
        labels={labels}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
