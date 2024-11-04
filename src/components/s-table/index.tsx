import { memo, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { IconChevronLeft, IconChevronRight, IconDots } from '@tabler/icons-react'
import { useMemoizedFn } from 'ahooks'
import { BaseTable, BaseTableProps, features, useTablePipeline } from 'ali-react-table'
import { Checkbox, Flex, Pagination, PaginationProps } from 'antd'
import classNames from 'classnames'

import IconButton from '@/components/icon-button'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import Empty, { EmptyProps } from '@/components/s-table/empty'
import { sum } from '@/utils'

import styles from './index.module.less'

type omit = 'columns' | 'dataSource' | 'primaryKey' | 'hasHeader' | 'isStickyHeader'

export interface STableProps<T=any> extends Omit<BaseTableProps, omit> {
  columns: BaseTableProps['columns']
  data: BaseTableProps['dataSource']
  width?: number
  hasHeader?: boolean
  rowKey?: string
  style?: React.CSSProperties
  init?: boolean
  rowSelection?: {
    value: number[]
    onChange: (value: number[]) => void
    width?: number
    hiddenTotal?: boolean
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
  fixPosition?: number
  rowClassName?: (row: any) => string
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
    rowClassName,
    ...rest
  } = props

  const { t } = useTranslation('common', { keyPrefix: 'table' })
  const offsetRef = useRef(0)

  const columns = useMemo(() => {
    if (!rowSelection?.value?.length) return cols
    return cols.map((col, index) => {
      if (index === 0) {
        return {
          ...col,
          title: (
            <Flex align={'center'} gap={20} className={styles.header}>
              <div className={styles.headerInner}>
                {t('已选中', { selected: rowSelection?.value?.length } || 0)}
              </div>
              <div className={styles.action}>{actions}</div>
            </Flex>
          )
        }
      }
      return { ...col, title: '' }
    })
  }, [cols])

  let p = useTablePipeline({ components: { Checkbox } })

  const pipeline = useMemo(() => {
    p = p.input({ dataSource: data, columns }).primaryKey(rowKey)

    if (rowSelection) {
      p = p.use(
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
      p = p.use(features.treeMode({
        openKeys: expand?.value as any,
        onChangeOpenKeys (nextKeys: string[], key: string, action: 'expand' | 'collapse') {
          expand?.onChange(nextKeys as any)
        }
      }))
    }

    return p
  }, [data, columns, rowKey, rowSelection, expand])

  console.log('Table Update')

  const isCheckboxDom = useMemoizedFn((e: any) => {
    const className = (e?.target)?.className?.split?.(' ') || []
    if (className?.[0] === 'art-table-cell' && className?.[1] === 'first') {
      return true
    }
    if (className?.[0] === 'shopkone-checkbox-input') {
      return true
    }
    return false
  })

  useEffect(() => {
    return () => {
      const main = document?.getElementById('shopkone-main')
      if (main) {
        main.onmousemove = null
      }
    }
  }, [])

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
        <SRender render={props.loading}>
          <div className={styles.loadingWrap} />
        </SRender>
        <BaseTable
          components={{
            EmptyContent: () => null,
            LoadingIcon: () => <SLoading />
          }}
          isStickyHeader
          hasHeader
          stickyTop={stickyTop}
          useVirtual={{ horizontal: false }}
          {...rest}
          {...pipeline.getProps()}
          getRowProps={(row, rowIndex) => ({
            ...pipeline.getProps()?.getRowProps,
            onMouseDown: onRowClick
              ? (e) => {
                  if (isCheckboxDom(e)) return
                  offsetRef.current = 0
                  const main = document?.getElementById('shopkone-main')
                  if (main) {
                    main.onmousemove = (e) => {
                      offsetRef.current = sum(Math.abs(e.offsetY), Math.abs(e.offsetX), offsetRef.current) || 0
                    }
                  }
                }
              : undefined,
            onMouseUp: onRowClick
              ? (e) => {
                  if (isCheckboxDom(e)) return
                  const main = document?.getElementById('shopkone-main')
                  if (main) {
                    main.onmousemove = null
                  }
                  if (offsetRef?.current < 500) {
                    onRowClick?.(row, rowIndex)
                  }
                  offsetRef.current = 0
                }
              : undefined,
            className: rowClassName?.(row)
          })}
          isLoading={props.loading}
        />
      </div>
      <SRender render={page ? Number(page.total) > 20 : null}>
        <Flex style={{ marginRight: 16 }} justify={'flex-end'}>
          <Pagination
            showTotal={(total) => `Total ${total} records`}
            prevIcon={<IconChevronLeft color={'#1f2329'} size={15} />}
            nextIcon={<IconChevronRight color={'#1f2329'} size={15} />}
            jumpNextIcon={
              <div style={{ position: 'relative', top: 3, left: 2, width: 24 }}>
                <IconButton
                  type={'text'}
                  size={24}
                >
                  <IconDots color={'#1f2329'} size={13} />
                </IconButton>
              </div>
            }
            jumpPrevIcon={
              <div style={{ position: 'relative', top: 3, left: 2, width: 24 }}>
                <IconButton
                  type={'text'}
                  size={24}
                >
                  <IconDots color={'#1f2329'} size={13} />
                </IconButton>
              </div>
            }
            showSizeChanger
            pageSizeOptions={['20', '50', '100']}
            {...page}
            onChange={(...p) => {
              if (p?.[0] !== page?.current || p?.[1] < Number(page?.pageSize || 0)) {
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
