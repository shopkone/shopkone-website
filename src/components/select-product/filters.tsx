import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconRefresh, IconSearch } from '@tabler/icons-react'
import { Button, Flex, Input, Typography } from 'antd'

import { FileType } from '@/api/file/add-file-record'
import SCompact from '@/components/s-compact'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import FilterNumberRange, { FilterNumberRangeProps } from '@/components/table-filter/filter-number-range'
import FilterRadio from '@/components/table-filter/filter-radio'
import FilterLabels from '@/components/table-filter/FilterLabels'

import styles from './index.module.less'

export interface FiltersProps {
  value?: {
    keyword?: string
    type?: string
    collection_id?: number
    status?: []
    PriceRange?: FilterNumberRangeProps['value']
  }
  onChange?: (value: FiltersProps['value']) => void
  groupName?: string
}

export default function Filters (props: FiltersProps) {
  const { onChange, value, groupName } = props
  const [labels, setLabels] = useState<Record<string, ReactNode>>({})
  const { t } = useTranslation('common')

  const options = [
    { value: FileType.Image, label: t('selectProduct.图片') },
    { value: FileType.Video, label: t('selectProduct.视频') },
    { value: FileType.Audio, label: t('selectProduct.音频') },
    { value: FileType.Other, label: t('selectProduct.其他') }
  ]

  const selectOptions = [
    { value: 'title', label: t('selectProduct.商品名称') },
    { value: 'vendor', label: t('selectProduct.商品供应商') },
    { value: 'sku', label: t('selectProduct.商品SKU') },
    { value: 'spu', label: t('selectProduct.商品SPU') },
    { value: 'id', label: t('selectProduct.商品ID') }
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
            <FilterNumberRange
              maxLabel={'Max size'}
              minLabel={'Min size'}
              unit={'MB'}
              onChange={(v) => {
                onChange?.({
                  ...value,
                  file_size: v
                })
              }}
              onLabelChange={(l) => {
                setLabels({
                  ...labels,
                  file_size: l
                })
              }}
              value={value?.file_size || {}}
            >
              {t('selectProduct.系列')}
            </FilterNumberRange>

            <FilterRadio
              options={options}
              onChange={(v) => {
                onChange?.({
                  ...value,
                  file_type: v.map(i => Number(i || 0))
                })
              }}
              value={value?.file_type}
              onLabelChange={(l) => {
                setLabels({
                  ...labels,
                  file_type: l
                })
              }}
            >
              {t('selectProduct.状态')}
            </FilterRadio>

            <FilterRadio
              options={[
                {
                  label: 'Used',
                  value: 1
                },
                {
                  label: 'Unused',
                  value: 2
                }
              ]}
              value={value?.used}
              onChange={(v) => {
                onChange?.({
                  ...value,
                  used: Number(v || 0)
                })
              }}
              onLabelChange={(l) => {
                setLabels({
                  ...labels,
                  used: l
                })
              }}
            >
              {t('selectProduct.售价')}
            </FilterRadio>
            <SRender render={groupName}>
              <Typography.Text className={styles.tag} ellipsis={{ tooltip: true }}>
                {groupName}
              </Typography.Text>
            </SRender>
          </Flex>
        </Flex>
        <Button
          type={'text'} style={{
            width: 24,
            height: 24
          }}
        >
          <IconRefresh
            style={{
              position: 'relative',
              left: -7,
              top: -2
            }} size={14}
          />
        </Button>
      </Flex>
      <FilterLabels style={{ marginTop: 12 }} labels={labels} value={value} onChange={onChange} />
    </div>
  )
}
