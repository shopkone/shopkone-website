import { memo } from 'react'
import { Left, More, Right } from '@icon-park/react'
import { BaseTable, BaseTableProps, features, useTablePipeline } from 'ali-react-table'
import { Button, Checkbox, Flex, Pagination, PaginationProps } from 'antd'
import classNames from 'classnames'

import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import Empty, { EmptyProps } from '@/components/s-table/empty'

import styles from './index.module.less'

type omit = 'columns' | 'dataSource' | 'primaryKey' | 'hasHeader' | 'isStickyHeader'

export interface STableProps extends Omit<BaseTableProps, omit> {
  columns: BaseTableProps['columns']
  data: BaseTableProps['dataSource']
  width?: number
  rowKey?: string
  style?: React.CSSProperties
  init: boolean
  rowSelection?: {
    value: number[]
    onChange: (value: number[]) => void
    width?: number
  }
  stickyTop?: number
  expand?: {
    value: number[]
    onChange: (value: number[]) => void
  }
  loading?: boolean
  empty?: EmptyProps
  borderless?: boolean
  page?: PaginationProps
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
    init,
    page,
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
        checkboxColumn: { width: rowSelection?.width, lock: true },
        highlightRowWhenSelected: true,
        checkboxPlacement: 'start',
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

  if (!init) {
    return (
      <SLoading loading size={'large'}>
        <div style={{ height: 300 }} />
      </SLoading>
    )
  }

  if (!data.length && !loading && empty) {
    return (
      <Empty {...empty} />
    )
  }

  return (
    <div className={classNames({ [styles.borderless]: borderless }, styles.table)} style={{ width, ...style }}>
      <div style={{ position: 'relative' }}>
        <SLoading loading={loading} size={'large'}>
          <BaseTable
            isStickyHeader
            hasHeader
            stickyTop={stickyTop}
            useVirtual={{ horizontal: false }}
            {...rest}
            {...pipeline.getProps()}
          />
        </SLoading>
      </div>
      <SRender render={page}>
        <Flex style={{ marginRight: 16 }} justify={'flex-end'}>
          <Pagination
            showTotal={(total) => `Total ${total} records`}
            prevIcon={<Left size={15} />}
            nextIcon={<Right size={15} />}
            jumpNextIcon={
              <Button
                type={'text'}
                size={'small'}
              >
                <More style={{ position: 'relative', left: -3 }} size={15} />
              </Button>
            }
            jumpPrevIcon={
              <Button
                type={'text'}
                size={'small'}
              >
                <More style={{ position: 'relative', left: -3 }} size={15} />
              </Button>
            }
            {...page}
            onChange={(...p) => {
              if (p?.[0] !== page?.current) {
                document?.getElementById('shopkone-main')?.scrollTo({ top: 0 })
              }
              page?.onChange?.(...p)
            }}
          />
        </Flex>
      </SRender>
    </div>
  )
}

export default memo(STable)
