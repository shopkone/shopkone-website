import { memo, useMemo } from 'react'
import { IconChevronLeft, IconChevronRight, IconDots } from '@tabler/icons-react'
import { BaseTable, BaseTableProps, features, useTablePipeline } from 'ali-react-table'
import { Button, Checkbox, Flex, Pagination, PaginationProps } from 'antd'
import classNames from 'classnames'

import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import Empty, { EmptyProps } from '@/components/s-table/empty'

import styles from './index.module.less'

type omit = 'columns' | 'dataSource' | 'primaryKey' | 'hasHeader' | 'isStickyHeader'

export interface STableProps<T=any> extends Omit<BaseTableProps, omit> {
  columns: BaseTableProps['columns']
  data: BaseTableProps['dataSource']
  width?: number
  rowKey?: string
  style?: React.CSSProperties
  init?: boolean
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
  actions?: React.ReactNode
  onRowClick?: (row: T, rowIndex: number) => void
}

function STable (props: STableProps) {
  const {
    columns: cols = [],
    data = [],
    width,
    rowKey = 'id',
    style,
    rowSelection,
    expand,
    stickyTop,
    loading = false,
    empty,
    borderless,
    init = false,
    page,
    actions,
    onRowClick,
    ...rest
  } = props

  const columns = useMemo(() => {
    if (!rowSelection?.value?.length) return cols
    return cols.map((col, index) => {
      if (index === 0) {
        return {
          ...col,
          title: (
            <Flex align={'center'} justify={'space-between'} className={styles.header}>
              <span style={{ position: 'relative', top: 1 }}>{rowSelection?.value?.length} selected</span>
              {actions}
            </Flex>
          )
        }
      }
      return col
    })
  }, [cols])

  let pipeline = useTablePipeline({ components: { Checkbox } })
    .input({
      dataSource: data,
      columns
    })
    .primaryKey(rowKey) // 每一行数据由 id 字段唯一标记

  if (rowSelection) {
    pipeline = pipeline.use(
      features.multiSelect({
        checkboxColumn: { width: rowSelection?.width || 40, lock: true },
        highlightRowWhenSelected: true,
        checkboxPlacement: 'start',
        value: rowSelection?.value as any,
        onChange: rowSelection.onChange as any,
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

  console.log('Table Update')

  if (!init) {
    return (
      <SLoading loading size={36}>
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
    <div
      className={
      classNames(
        {
          [styles.borderless]: borderless,
          [styles.selected]: rowSelection?.value?.length,
          [styles.rowClick]: onRowClick
        },
        styles.table
      )
      }
      style={{ width, ...style }}
    >
      <div style={{ position: 'relative' }}>
        <SLoading foreShow loading={loading} size={36}>
          <BaseTable
            components={{
              EmptyContent: () => <div />
            }}
            isStickyHeader
            hasHeader
            stickyTop={stickyTop}
            useVirtual={{ horizontal: false }}
            {...rest}
            {...pipeline.getProps()}
            getRowProps={(row, rowIndex) => ({
              ...pipeline.getProps()?.getRowProps,
              onClick: (e) => {
                const className = (e?.target as any)?.className?.split(' ') || []
                if (className?.[0] === 'art-table-cell' && className?.[1] === 'first') {
                  return
                }
                if (className?.[0] === 'shopkone-checkbox-input') {
                  return
                }
                onRowClick?.(row, rowIndex)
              }
            })}
          />
        </SLoading>
      </div>
      <SRender render={page ? Number(page.total) > 20 : null}>
        <Flex style={{ marginRight: 16 }} justify={'flex-end'}>
          <Pagination
            showTotal={(total) => `Total ${total} records`}
            prevIcon={<IconChevronLeft color={'#1f2329'} size={15} />}
            nextIcon={<IconChevronRight color={'#1f2329'} size={15} />}
            jumpNextIcon={
              <Button
                type={'text'}
                size={'small'}
              >
                <IconDots color={'#1f2329'} style={{ position: 'relative', left: -4, top: 1 }} size={14} />
              </Button>
            }
            jumpPrevIcon={
              <Button
                type={'text'}
                size={'small'}
              >
                <IconDots color={'#1f2329'} style={{ position: 'relative', left: -4, top: 1 }} size={14} />
              </Button>
            }
            showSizeChanger
            pageSizeOptions={['20', '50', '100']}
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
