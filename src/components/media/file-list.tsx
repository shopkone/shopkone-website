import { useEffect, useState } from 'react'
import {
  closestCenter,
  DndContext,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import type { DragCancelEvent, DragEndEvent } from '@dnd-kit/core/dist/types'
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { IconPlus } from '@tabler/icons-react'
import { useMemoizedFn, useRequest } from 'ahooks'
import { Button } from 'antd'
import isEqual from 'lodash/isEqual'

import { fileListByIds, FileListByIdsRes } from '@/api/file/file-list-by-ids'
import FileItem from '@/components/media/file-item'
import FileItemSortable from '@/components/media/file-item-sortable'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import { useOpen, UseOpenType } from '@/hooks/useOpen'
import FileInfo from '@/pages/mange/settings/files/file-info'

import styles from './index.module.less'

export interface FileListProps {
  ids: number[]
  onChange?: (value: number[]) => Promise<void>
  selectOpenInfo: UseOpenType<number[]>
  onSelect: (ids: number[]) => void
  select: number[]
}

export default function FileList (props: FileListProps) {
  const { ids, onChange, selectOpenInfo, select, onSelect } = props
  const list = useRequest(fileListByIds, { manual: true })
  const [activeId, setActiveId] = useState(0)
  const [items, setItems] = useState<FileListByIdsRes[]>([])
  const fileOpen = useOpen<number>()

  // dnd 相关
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 8 } })
  )

  // 拖动事件监听
  const onDragStart = useMemoizedFn((e: DragStartEvent) => {
    setActiveId(Number(e.active.id || 0))
  })
  const onDragEnd = useMemoizedFn((e: DragEndEvent) => {
    const { active, over } = e
    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over?.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
    setActiveId(0)
  })

  const onDragCancel = useMemoizedFn((e: DragCancelEvent) => {
    setActiveId(0)
  })

  const onClick = useMemoizedFn((row: FileListByIdsRes) => {
    if (select.length) {
      onSelectHandle(row.id)
    } else {
      fileOpen.edit(row.id)
    }
  })

  const onSelectHandle = useMemoizedFn((id: number) => {
    if (select?.includes(id)) {
      onSelect?.(select.filter(i => i !== id))
    } else {
      onSelect?.([...(select || []), id])
    }
  })

  useEffect(() => {
    onChange?.(items.map(item => item.id))
  }, [items])

  // 加载数据
  useEffect(() => {
    if (isEqual(items.map(item => item.id), ids)) return
    if (!ids?.length) {
      setItems([])
      return
    }
    const needFetch = ids.filter(id => !items.find(item => item.id === id))
    if (needFetch?.length) {
      list.runAsync({ ids: needFetch }).then(res => {
        const newItems = ids.map(i => {
          const itemValue = items.find(item => item.id === i)
          const resValue = res.find(item => item.id === i)
          return resValue || itemValue
        })
        setItems(newItems.filter(Boolean) as FileListByIdsRes[])
      })
    } else {
      const newItems = items.filter(item => ids.includes(item.id))
      setItems(newItems)
    }
  }, [ids])

  // 空或者加载直接返回
  if (list.loading) return <div style={{ marginTop: 64 }}><SLoading /></div>
  if (!list.data?.length) return null

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
      >
        <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${6}, 1fr)`,
              gridGap: 8
            }}
          >
            {
              items.map((item, index) => (
                <FileItemSortable
                  onSelect={() => { onSelectHandle?.(item.id) }}
                  select={select.includes(item.id)}
                  onClick={() => { onClick(item) }}
                  index={index}
                  key={item.id}
                  path={item.path}
                  k={item.id}
                />
              ))
            }
            <SRender render={items.length}>
              <Button onClick={() => { selectOpenInfo.edit(ids) }} className={styles.addBtn}>
                <IconPlus size={16} />
              </Button>
            </SRender>
          </div>
        </SortableContext>

        <DragOverlay adjustScale={true}>
          <SRender render={activeId}>
            <FileItem
              select={select.includes(activeId)}
              onSelect={() => { onSelectHandle?.(activeId) }}
              dragging={!!activeId}
              path={items.find(item => item.id === activeId)?.path}
              index={items.findIndex(item => item.id === activeId)}
            />
          </SRender>
        </DragOverlay>
      </DndContext>

      <FileInfo open={fileOpen} groups={[]} reFresh={() => {}} />
    </div>
  )
}
