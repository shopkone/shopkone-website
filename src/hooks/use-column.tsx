import { useEffect, useMemo, useState } from 'react'
import { IconGripVertical, IconMenu2 } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Checkbox, Flex, Popover } from 'antd'
import classNames from 'classnames'
import isEqual from 'lodash/isEqual'

import { GetColumnsApi } from '@/api/user/user-get-columns'
import { ColumnItem, SetColumnsApi, UserColumnType } from '@/api/user/user-set-columns'
import IconButton from '@/components/icon-button'
import SRender from '@/components/s-render'
import { STableProps } from '@/components/s-table'
import Sortable from '@/components/sortable'
import ItemSortable from '@/components/sortable/sortable-item'

import styles from './use-column-style.module.less'

type ColumnType = STableProps['columns'][number]

export interface UseColumnType extends ColumnType {
  forceHidden?: boolean
  nick?: string
  required?: boolean
}

export const useColumn = (local: UseColumnType[], type: UserColumnType) => {
  const remote = useRequest(GetColumnsApi, { manual: true })
  const setColumns = useRequest(SetColumnsApi, { manual: true })
  const [cols, setCols] = useState<Array<ColumnItem & { id: number }>>([])

  const initCols = async (res: ColumnItem[]) => {
    if (!local?.length) return
    if (remote?.loading) return
    const localNames = local.map(item => item.name)
    const remoteNames = res.map(item => item.name)
    if (localNames.length === remoteNames.length && remoteNames.length) return
    const cols: ColumnItem[] = local.map(item => ({
      name: item.name,
      lock: item.lock,
      hidden: item.hidden,
      required: item.required,
      nick: item.nick || item.title?.toString() || ''
    }))
    await setColumns.runAsync({ type, columns: cols })
    await remote.runAsync({ type })
  }

  const onChange = async (columns: Array<ColumnItem & { id: number }>) => {
    const changeRequire = cols.some((item, index) => {
      return columns?.[index]?.name !== item.name && (item.required || item.required)
    })
    if (changeRequire) return
    setCols(columns)
    await setColumns.runAsync({ type, columns })
  }

  useEffect(() => {
    if (!type) return
    remote.runAsync({ type }).then(res => {
      initCols(res.columns)
    })
  }, [type])

  useEffect(() => {
    if (!remote?.data?.columns?.length) return
    const oldList = cols.map(item => ({ ...item, id: undefined }))
    const newList = remote?.data?.columns?.map(item => ({ ...item, id: undefined }))
    if (isEqual(oldList, newList)) return
    setCols(remote.data?.columns?.map((i, index) => ({ ...i, id: index + 1 })) || [])
  }, [remote?.data?.columns])

  const columns = cols.map(item => {
    const find = local.find(i => i.name === item.name)
    return { ...find, ...item, hidden: find?.forceHidden || item.hidden }
  }).filter(Boolean) as ColumnType[]

  const renderCols = cols.map(item => {
    const find = local.find(i => i.name === item.name)
    return { ...item, forceHidden: find?.forceHidden }
  }).filter(Boolean) as any[]

  const ColumnSettings = useMemo(() => (
    <Popover
      arrow={false}
      trigger={'click'}
      overlayInnerStyle={{ padding: 0, overflow: 'hidden' }}
      placement={'bottomRight'}
      content={
        <Sortable<ColumnItem> onChange={onChange} items={renderCols}>
          {
            (items, id, isBg) => items?.map((item, index) => (
              <SRender key={item.id} render={!item.forceHidden}>
                <ItemSortable
                  disabled={item.required}
                  className={classNames(styles.item, isBg && styles.draggingItem)}
                  draggingClassName={styles.hidden}
                  rowKey={item?.id}
                  index={index}
                  key={item.id}
                >
                  <Flex gap={8}>
                    <Checkbox
                      disabled={item.required}
                      checked={!item.hidden || item.required}
                      onClick={() => {
                        if (item.required) return
                        const newItem = { ...item, hidden: !item.hidden }
                        onChange(cols.map(i => i.id === newItem.id ? newItem : i))
                      }}
                    />
                    <Flex align={'center'} flex={1}>
                      <span
                        onClick={() => {
                          if (item.required) return
                          const newItem = { ...item, hidden: !item.hidden }
                          onChange(cols.map(i => i.id === newItem.id ? newItem : i))
                        }}
                        style={{ cursor: item.required ? undefined : 'pointer', pointerEvents: item.required ? 'none' : undefined, userSelect: 'none' }}
                      >
                        {item.nick}
                      </span>
                    </Flex>
                    <IconButton
                      disabled={item.required}
                      style={{ cursor: isBg ? 'grabbing' : undefined }}
                      className={styles.btn}
                      type={'text'}
                      size={24}
                    >
                      <IconGripVertical size={14} />
                    </IconButton>
                  </Flex>
                </ItemSortable>
              </SRender>
            ))
          }
        </Sortable>
      }
    >
      <IconButton type={'text'} size={25}>
        <IconMenu2 size={15} />
      </IconButton>
    </Popover>
  ), [renderCols])

  return { columns: columns || [], ColumnSettings }
}
