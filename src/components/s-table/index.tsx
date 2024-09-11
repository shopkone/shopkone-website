import { memo } from 'react'
import { BaseTable, BaseTableProps } from 'ali-react-table'
import { TableProps } from 'antd'

import { useSelector } from '@/components/s-table/selector'

export interface STableProps {
  columns: BaseTableProps['columns']
  data: BaseTableProps['dataSource']
  width?: number
  rowKey?: string
  style?: React.CSSProperties
  rowSelection?: TableProps['rowSelection']
  stickyTop?: number
}

function STable (props: STableProps) {
  const { columns: c = [], data, width, rowKey = 'id', style, rowSelection, stickyTop } = props

  const selector = useSelector(rowKey, data)

  const columns: STableProps['columns'] = rowSelection
    ? [selector.col, ...c]
    : c

  return (
    <div style={{ width, ...style }}>
      <BaseTable
        isStickyHeader
        hasHeader
        stickyTop={stickyTop}
        primaryKey={rowKey}
        columns={columns}
        dataSource={data}
      />
    </div>
  )
}

export default memo(STable)
