import { Button, Flex, Input, Typography } from 'antd'

import { FileType } from '@/api/file/add-file-record'
import { ReactComponent as SearchIcon } from '@/assets/icon/search.svg'
import SRender from '@/components/s-render'
import TableFilter from '@/components/table-filter'
import { FilterNumberRangeProps } from '@/components/table-filter/filter-number-range'

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

  const options = [
    { value: FileType.Image, label: 'Image' },
    { value: FileType.Video, label: 'Video' },
    { value: FileType.Audio, label: 'Audio' },
    { value: FileType.Other, label: 'Other' }
  ]

  return (
    <div>
      <Input
        value={value?.keyword}
        onChange={(e) => {
          onChange?.({ ...value, keyword: e.target.value })
        }}
        allowClear
        prefix={<SearchIcon />}
        placeholder={'Search files'}
        size={'small'}
        variant={'borderless'}
        style={{
          marginLeft: 8,
          width: 320
        }}
      />
      <div style={{ margin: '6px 0' }} className={'line'} />
      <Flex
        align={'center'}
        gap={8}
        style={{
          marginLeft: 8,
          marginBottom: 8,
          marginTop: 8
        }}
      >
        <TableFilter
          numberRange={{
            maxLabel: 'Max size',
            minLabel: 'Min size',
            unit: 'MB',
            onChange: (v) => {
              onChange?.({ ...value, file_size: v })
            },
            value: value?.file_size || {}
          }}
        >
          File size
        </TableFilter>

        <TableFilter
          checkbox={{
            options,
            onChange: (v) => {
              onChange?.({ ...value, file_type: v.map(i => Number(i || 0)) })
            },
            value: value?.file_type
          }}
        >
          File type
        </TableFilter>

        <TableFilter
          radio={{
            options: [
              { label: 'Used', value: 1 },
              { label: 'Unused', value: 2 }
            ],
            onChange: (v) => {
              onChange?.({ ...value, used: Number(v || 0) })
            },
            value: value?.used
          }}
        >
          Used
        </TableFilter>

        <SRender render={groupName}>
          <Typography.Text style={{ maxWidth: 150, fontSize: 12, padding: '5px 8px', borderRadius: 8, border: '1px solid #d0d3d6', lineHeight: 1, fontWeight: 550 }} ellipsis>
            {groupName}
          </Typography.Text>
        </SRender>

        <SRender render={!!Object.values(value?.file_size || {})?.filter(i => i)?.length || !!value?.file_type?.length || !!value?.used}>
          <Button
            onClick={() => {
              onChange?.({ ...value, file_size: undefined, file_type: undefined, used: undefined })
            }}
            type={'link'}
            size={'small'}
            className={'link-btn'}
          >
            Clear all
          </Button>
        </SRender>
      </Flex>
    </div>
  )
}
