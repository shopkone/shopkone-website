import { Flex, Input } from 'antd'

import { ReactComponent as SearchIcon } from '@/assets/icon/search.svg'
import TableFilter from '@/components/table-filter'
import { FilterNumberRangeProps } from '@/components/table-filter/filter-number-range'

export interface FiltersProps {
  onSearch?: (value?: string) => void
  value?: {
    keyword?: string
    fileSize?: FilterNumberRangeProps['value']
  }
  onChange?: (value: FiltersProps['value']) => void
}

export default function Filters (props: FiltersProps) {
  const { onSearch, onChange, value } = props
  return (
    <div>
      <Input
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
        gap={8}
        style={{
          marginLeft: 8,
          marginBottom: 8,
          marginTop: 8
        }}
      >
        <TableFilter
          numberRange={{
            maxLabel: 'Min size',
            minLabel: 'Max size',
            unit: 'MB',
            onChange: (value) => {
              onChange?.({ ...value, fileSize: value })
            },
            value: value?.fileSize
          }}
        >
          File size
        </TableFilter>
      </Flex>
    </div>
  )
}
