import { useTranslation } from 'react-i18next'
import { IconSearch } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Flex, Input } from 'antd'

import { CollectionOptionsApi } from '@/api/collection/options'
import SCompact from '@/components/s-compact'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import FilterNumberRange, { FilterNumberRangeProps } from '@/components/table-filter/filter-number-range'
import FilterRadio from '@/components/table-filter/filter-radio'
import { VariantStatus } from '@/constant/product'

import styles from './index.module.less'

export interface FiltersProps {
  value?: {
    keyword?: string
    type?: string
    collection_id?: number
    status?: VariantStatus
    price_range?: FilterNumberRangeProps['value']
  }
  onChange?: (value: FiltersProps['value']) => void
}

export default function Filters (props: FiltersProps) {
  const { onChange, value } = props
  const { t } = useTranslation('common')
  const collectionOptions = useRequest(CollectionOptionsApi)

  const selectOptions = [
    { value: 'title', label: t('selectProduct.商品名称') },
    { value: 'vendor', label: t('selectProduct.商品供应商') },
    { value: 'sku', label: t('selectProduct.商品SKU') },
    { value: 'spu', label: t('selectProduct.商品SPU') },
    { value: 'id', label: t('selectProduct.商品ID') }
  ]

  const statusOptions = [
    { label: t('selectProduct.草稿'), value: VariantStatus.Draft },
    { label: t('selectProduct.已发布'), value: VariantStatus.Published }
  ]

  return (
    <div
      style={{
        marginBottom: 12,
        marginTop: 12,
        marginLeft: 16,
        marginRight: 16
      }}
    >
      <Flex align={'center'} justify={'space-between'}>
        <Flex align={'center'} gap={20}>
          <SCompact>
            <SSelect
              options={selectOptions}
              style={{ minWidth: 100 }}
              dropdownStyle={{ minWidth: 150 }}
              size={'small'}
            />
            <Input
              value={value?.keyword}
              onChange={(e) => {
                onChange?.({
                  ...value,
                  keyword: e.target.value
                })
              }}
              allowClear
              prefix={<IconSearch size={15} className={styles['filter-icon']} />}
              placeholder={t('selectProduct.搜索商品')}
              style={{
                width: 200
              }}
              size={'small'}
            />
          </SCompact>
          <Flex
            align={'center'}
            gap={8}
          >
            <SRender render={collectionOptions?.data?.length}>
              <FilterRadio
                onChange={(v) => {
                  onChange?.({ ...value, collection_id: Number(v || 0) })
                }}
                options={collectionOptions?.data || []}
                value={value?.collection_id}
              >
                {t('selectProduct.系列')}
              </FilterRadio>
            </SRender>

            <FilterRadio
              options={statusOptions}
              onChange={(v) => {
                onChange?.({ ...value, status: Number(v || 0) })
              }}
              value={value?.status}
            >
              {t('selectProduct.状态')}
            </FilterRadio>

            <FilterNumberRange
              value={value?.price_range}
              onChange={(v) => {
                onChange?.({ ...value, price_range: v })
              }}
              maxLabel={t('selectProduct.最高价')}
              minLabel={t('selectProduct.最低价')}
              unit={'$'}
            >
              {t('selectProduct.售价')}
            </FilterNumberRange>
          </Flex>
        </Flex>

      </Flex>
    </div>
  )
}
