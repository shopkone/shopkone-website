import { useMemo, useState } from 'react'
import { useMemoizedFn } from 'ahooks'
import { Checkbox } from 'antd'

import { STableProps } from '@/components/s-table/index'

export interface UserSelectorResult {
  col: STableProps['columns'][number]
  select: Array<number | string>
}

export const useSelector = (rowKey: string, data?: STableProps['data']): UserSelectorResult => {
  const [select, setSelect] = useState<Array<string | number>>([])
  const keys = data?.map(item => item[rowKey])

  const onSelectAll = useMemoizedFn(() => {
    if (select.length && select.length === keys?.length) { setSelect([]); return }
    setSelect(keys || [])
  })

  const onSelect = useMemoizedFn((id: number | string) => {
    setSelect(select.includes(id) ? select.filter(item => item !== id) : [...select, id])
  })

  const isSelectAll = useMemo(() => select.length && select.length === keys?.length, [select, keys])
  const isSelectIn = useMemo(() => select.length && select.length > 0, [select])

  return useMemo(() => ({
    col: {
      title: <Checkbox checked={!!isSelectAll} indeterminate={!isSelectAll && !!isSelectIn} onClick={onSelectAll} />,
      code: rowKey,
      name: rowKey,
      lock: true,
      width: 40,
      render: (id: number | string) => (
        <Checkbox
          onClick={() => { onSelect(id) }}
          checked={select.includes(id)}
        />
      )
    },
    select
  }), [rowKey, select])
}
