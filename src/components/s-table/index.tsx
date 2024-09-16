import { memo } from 'react'
import { BaseTable, BaseTableProps, features, useTablePipeline } from 'ali-react-table'
import { Checkbox } from 'antd'

type omit = 'columns' | 'dataSource' | 'primaryKey' | 'hasHeader' | 'isStickyHeader'

export interface STableProps extends Omit<BaseTableProps, omit> {
  columns: BaseTableProps['columns']
  data: BaseTableProps['dataSource']
  width?: number
  rowKey?: string
  style?: React.CSSProperties
  rowSelection?: {
    value: number[]
    onChange: (value: number[]) => void
  }
  stickyTop?: number
  expand?: {
    value: number[]
    onChange: (value: number[]) => void
  }
}

function STable (props: STableProps) {
  const {
    columns = [],
    data = [],
    width,
    rowKey = 'id',
    style,
    rowSelection,
    expand,
    stickyTop,
    ...rest
  } = props

  let pipeline = useTablePipeline({ components: { Checkbox } })
    .input({
      dataSource: data,
      columns
    })
    .primaryKey(rowKey) // 每一行数据由 id 字段唯一标记

  if (rowSelection) {
    pipeline = pipeline.use(
      features.multiSelect({
        highlightRowWhenSelected: true,
        checkboxPlacement: 'start',
        checkboxColumn: { lock: true },
        clickArea: 'cell'
      })
    )
  }

  if (expand) {
    pipeline = pipeline
      .use(features.treeMode({
        openKeys: expand?.value as any,
        onChangeOpenKeys (nextKeys: string[], key: string, action: 'expand' | 'collapse') {
          expand?.onChange(nextKeys as any)
        }
      }))
      .use(features.treeSelect({
        tree: data,
        rootKey: rowKey,
        checkboxPlacement: 'start',
        clickArea: 'checkbox',
        checkboxColumn: { hidden: true },
        highlightRowWhenSelected: true
      }))
  }

  return (
    <div style={{ width, ...style }}>
      <BaseTable
        isStickyHeader
        hasHeader
        stickyTop={stickyTop}
        useVirtual={{ horizontal: false }}
        {...rest}
        {...pipeline.getProps()}
      />
    </div>
  )
}

export default memo(STable)
