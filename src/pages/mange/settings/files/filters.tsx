import { ReactNode, useState } from 'react'
import { IconSearch } from '@tabler/icons-react'
import { Flex, Input, Typography } from 'antd'

import { FileType } from '@/api/file/add-file-record'
import SRender from '@/components/s-render'
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
  groupName?: string
}

export default function Filters (props: FiltersProps) {
  const { onChange, value, groupName } = props
  const [labels, setLabels] = useState<Record<string, ReactNode>>({})

  const options = [
    { value: FileType.Image, label: 'Image' },
    { value: FileType.Video, label: 'Video' },
    { value: FileType.Audio, label: 'Audio' },
    { value: FileType.Other, label: 'Other' }
  ]

  return (
    <div style={{ marginBottom: 12, marginTop: 4, marginLeft: 16 }}>
      <Flex align={'center'} gap={20}>
        <div>
          <Input
            value={value?.keyword}
            onChange={(e) => {
              onChange?.({ ...value, keyword: e.target.value })
            }}
            allowClear
            prefix={<IconSearch size={15} className={styles['filter-icon']} />}
            placeholder={'Search files'}
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
          <FilterNumberRange
            maxLabel={'Max size'}
            minLabel= {'Min size'}
            unit={'MB'}
            onChange={(v) => { onChange?.({ ...value, file_size: v }) }}
            onLabelChange={(l) => { setLabels({ ...labels, file_size: l }) }}
            value={value?.file_size || {}}
          >
            File size
          </FilterNumberRange>

          <FilterCheckbox
            options={options}
            onChange={(v) => {
              onChange?.({ ...value, file_type: v.map(i => Number(i || 0)) })
            }}
            value={value?.file_type}
            onLabelChange={(l) => { setLabels({ ...labels, file_type: l }) }}
          >
            File type
          </FilterCheckbox>

          <FilterRadio
            options={[
              { label: 'Used', value: 1 },
              { label: 'Unused', value: 2 }
            ]}
            value={value?.used}
            onChange={(v) => { onChange?.({ ...value, used: Number(v || 0) }) }}
            onLabelChange={(l) => { setLabels({ ...labels, used: l }) }}
          >
            Used
          </FilterRadio>

          <SRender render={groupName}>
            <Typography.Text className={styles.tag} ellipsis={{ tooltip: true }}>
              {groupName}
            </Typography.Text>
          </SRender>
        </Flex>
      </Flex>
      <FilterLabels style={{ marginTop: 12 }} labels={labels} value={value} onChange={onChange} />
    </div>
  )
}
