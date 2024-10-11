import { ReactNode, useState } from 'react'
import { IconArrowsSort, IconFilter, IconMenu2, IconSearch } from '@tabler/icons-react'
import { Button, Flex, Input } from 'antd'

import { FileType } from '@/api/file/add-file-record'
import FilterCheckbox from '@/components/table-filter/filter-checkbox'
import FilterNumberRange, { FilterNumberRangeProps } from '@/components/table-filter/filter-number-range'
import FilterRadio from '@/components/table-filter/filter-radio'
import FilterLabels from '@/components/table-filter/FilterLabels'

import styles from './index.module.less'

export interface FiltersProps {
  value?: {
    keyword?: string
    file_size?: FilterNumberRangeProps['value']
    file_type?: number[]
    used?: number
  }
  onChange?: (value: FiltersProps['value']) => void
}

export default function Filters (props: FiltersProps) {
  const { onChange, value } = props
  const [labels, setLabels] = useState<Record<string, ReactNode>>({})

  const options = [
    { value: FileType.Image, label: 'Image' },
    { value: FileType.Video, label: 'Video' },
    { value: FileType.Audio, label: 'Audio' },
    { value: FileType.Other, label: 'Other' }
  ]

  return (
    <div>
      <Flex gap={4} className={styles.btns}>
        <Button type={'text'} size={'small'}>All</Button>
        <Button type={'text'} size={'small'}>Active</Button>
        <Button type={'text'} size={'small'}>Draft</Button>
        <Button type={'text'} size={'small'}>Archived</Button>
      </Flex>
      <div className={'line'} style={{ margin: '8px 0' }} />
      <Flex style={{ margin: '12px 24px' }} align={'center'} justify={'space-between'}>
        <Flex align={'center'} gap={20}>
          <div>
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
              placeholder={'Searching all products'}
              size={'small'}
              style={{
                width: 250
              }}
            />
          </div>
          <Flex
            align={'center'}
            gap={8}
          >

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
              Collections
            </FilterRadio>

            <FilterCheckbox
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
              Tags
            </FilterCheckbox>

            <FilterNumberRange
              maxLabel={'Max price'}
              minLabel={'Min price'}
              unit={'$'}
              prefix
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
              Price range
            </FilterNumberRange>

          </Flex>
        </Flex>

        <Flex className={styles.actions} gap={12}>
          <Button size={'small'} style={{ width: 26, height: 26 }}>
            <IconFilter strokeWidth={2.5} size={14} />
          </Button>
          <Button size={'small'} style={{ width: 26, height: 26 }}>
            <IconMenu2 strokeWidth={2.5} size={14} />
          </Button>
          <Button size={'small'} style={{ width: 26, height: 26 }}>
            <IconArrowsSort strokeWidth={2.1} size={14} />
          </Button>
        </Flex>
      </Flex>

      <FilterLabels style={{ marginTop: 12 }} labels={labels} value={value} onChange={onChange} />
    </div>
  )
}
