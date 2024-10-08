import { useEffect, useMemo, useState } from 'react'
import { IconGripVertical, IconMenu2 } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Checkbox, Flex, Popover } from 'antd'
import classNames from 'classnames'
import isEqual from 'lodash/isEqual'

import { GetColumnsApi } from '@/api/user/user-get-columns'
import { ColumnItem, SetColumnsApi, UserColumnType } from '@/api/user/user-set-columns'
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
        <Sortable<ColumnItem>
          onChange={onChange}
          items={renderCols}
          overlay
        >
          {
            (items, id, isBg) => items?.map((item, index) => (
              <SRender key={item.id} render={!item.forceHidden}>
                <ItemSortable
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
                    <Flex align={'center'} style={{ pointerEvents: 'none' }} flex={1}>
                      {item.nick}
                    </Flex>
                    <Button style={{ cursor: isBg ? 'grabbing' : undefined }} className={styles.btn} type={'text'} size={'small'}>
                      <IconGripVertical style={{ position: 'relative', left: -4 }} size={14} />
                    </Button>
                  </Flex>
                </ItemSortable>
              </SRender>
            ))
          }
        </Sortable>
      }
    >
      <Button
        style={{ height: 25, width: 25 }}
        type={'text'}
        size={'small'}
      >
        <IconMenu2 style={{ position: 'relative', left: -4 }} size={16} />
      </Button>
    </Popover>
  ), [renderCols])

  return { columns: columns || [], ColumnSettings }
}
