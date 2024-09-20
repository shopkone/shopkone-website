import { memo, useMemo } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { BaseTable, BaseTableProps, features, useTablePipeline } from 'ali-react-table'
import { Checkbox, Spin } from 'antd'
import classNames from 'classnames'

import Empty, { EmptyProps } from '@/components/s-table/empty'

import styles from './index.module.less'

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
  loading?: boolean
  empty?: EmptyProps
  borderless?: boolean
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
    loading,
    empty,
    borderless,
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

  const LoadingContent = useMemo(() => (
    <div style={{ position: 'relative', top: 12, textAlign: 'center' }}>
      <Spin spinning indicator={<LoadingOutlined style={{ fontSize: 32 }} />} />
    </div>
  ), [])

  if (!data.length && !loading && empty) {
    return (
      <Empty {...empty} />
    )
  }

  return (
    <div className={classNames({ [styles.borderless]: borderless })} style={{ width, ...style }}>
      <BaseTable
        components={{ LoadingIcon: () => LoadingContent }}
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
