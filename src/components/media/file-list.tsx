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
}

export default function FileList (props: FileListProps) {
  const { ids, onChange, selectOpenInfo } = props
  const list = useRequest(fileListByIds, { manual: true })
  const [activeId, setActiveId] = useState(0)
  const [items, setItems] = useState<FileListByIdsRes[]>([])
  const fileOpen = useOpen<number>()

  // dnd 相关
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } })
  )

  // 加载数据
  useEffect(() => {
    if (isEqual(items.map(item => item.id), ids)) return
    if (!ids?.length) {
      setItems([])
      return
    }
    list.runAsync({ ids }).then(res => {
      setItems(res)
    })
  }, [ids])

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
    fileOpen.edit(row.id)
  })

  useEffect(() => {
    onChange?.(items.map(item => item.id))
  }, [items])

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
