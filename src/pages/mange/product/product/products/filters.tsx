import { ReactNode, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconArrowsSort, IconFilter, IconMenu2, IconSearch } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Input } from 'antd'
import classNames from 'classnames'

import { CollectionOptionsApi } from '@/api/collection/options'
import IconButton from '@/components/icon-button'
import SSelect from '@/components/s-select'
import FilterCheckbox from '@/components/table-filter/filter-checkbox'
import FilterLabels from '@/components/table-filter/FilterLabels'
import { VariantStatus } from '@/constant/product'

import styles from './index.module.less'

interface ValueType {
  status: VariantStatus | 0
  type: string
  keyword: string
  collections: number[]
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

  const onChangeHandle = (field: keyof ValueType, v: ValueType[keyof ValueType]) => {
    onChange?.({ ...value, [field]: v } as any)
  }

  const keywords = useMemo(() => ([
    { label: t('商品标题'), value: 'title' },
    { label: t('商品SPU'), value: 'spu' },
    { label: t('变体名称'), value: 'variant_name' },
    { label: t('SKU'), value: 'variant_sku' }
  ]), [t])

  return (
    <div>
      <Flex gap={4} className={styles.btns}>
        <Button
          className={classNames(value?.status === 0 && styles.activeBtn)}
          onClick={() => { onChangeHandle('status', 0) }}
          type={'text'}
          size={'small'}
        >
          {t('全部')}
        </Button>
        <Button
          className={classNames(value?.status === VariantStatus.Published && styles.activeBtn)}
          onClick={() => { onChangeHandle('status', VariantStatus.Published) }}
          type={'text'}
          size={'small'}
        >
          {t('已上架')}
        </Button>
        <Button
          className={classNames(value?.status === VariantStatus.Draft && styles.activeBtn)}
          type={'text'}
          size={'small'}
          onClick={() => { onChangeHandle('status', VariantStatus.Draft) }}
        >
          {t('已下架')}
        </Button>
      </Flex>
      <div className={'line'} style={{ margin: '8px 0' }} />
      <Flex style={{ margin: 8 }} align={'center'} justify={'space-between'}>
        <Flex align={'center'} gap={20}>
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
          >
            {t('筛选系列')}
          </FilterCheckbox>

          <FilterCheckbox
            options={collections?.data || []}
            onChange={(v) => {
              onChangeHandle('collections', v)
            }}
            value={value?.collections}
          >
            {t('筛选标签')}
          </FilterCheckbox>
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

      <FilterLabels style={{ marginTop: 12 }} labels={labels} value={value} onChange={onChange} />
    </div>
  )
}
