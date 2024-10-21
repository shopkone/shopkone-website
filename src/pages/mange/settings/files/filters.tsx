import { ReactNode, useState } from 'react'
import { IconSearch } from '@tabler/icons-react'
import { Flex, Input, Typography } from 'antd'

import { FileType } from '@/api/file/add-file-record'
import SRender from '@/components/s-render'
import FilterCheckbox from '@/components/table-filter/filter-checkbox'
import FilterNumberRange, { FilterNumberRangeProps } from '@/components/table-filter/filter-number-range'
import FilterRadio from '@/components/table-filter/filter-radio'
import { useI18n } from '@/hooks/use-lang'

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

  const t = useI18n()

  const options = [
    { value: FileType.Image, label: t('图片') },
    { value: FileType.Video, label: t('视频') },
    { value: FileType.Audio, label: t('音频') },
    { value: FileType.Other, label: t('其他') }
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
            placeholder={t('搜索文件')}
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
            maxLabel={t('最大大小')}
            minLabel={t('最小大小')}
            unit={'MB'}
            onChange={(v) => { onChange?.({ ...value, file_size: v }) }}
            onLabelChange={(l) => { setLabels({ ...labels, file_size: l }) }}
            value={value?.file_size || {}}
          >
            {t('文件大小')}
          </FilterNumberRange>

          <FilterCheckbox
            options={options}
            onChange={(v) => {
              onChange?.({ ...value, file_type: v.map(i => Number(i || 0)) })
            }}
            value={value?.file_type}
            onLabelChange={(l) => { setLabels({ ...labels, file_type: l }) }}
          >
            {t('文件类型')}
          </FilterCheckbox>

          <FilterRadio
            options={[
              { label: t('已使用'), value: 1 },
              { label: t('未使用'), value: 2 }
            ]}
            value={value?.used}
            onChange={(v) => { onChange?.({ ...value, used: Number(v || 0) }) }}
            onLabelChange={(l) => { setLabels({ ...labels, used: l }) }}
          >
            {t('已使用')}
          </FilterRadio>

          <SRender render={groupName}>
            <Typography.Text className={styles.tag} ellipsis={{ tooltip: true }}>
              {groupName}
            </Typography.Text>
          </SRender>
        </Flex>
      </Flex>
    </div>
  )
}
