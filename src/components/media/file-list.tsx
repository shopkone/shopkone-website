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
import { useRequest } from 'ahooks'

import { fileListByIds, FileListByIdsRes } from '@/api/file/file-list-by-ids'
import FileItem from '@/components/media/file-item'
import FileItemSortable from '@/components/media/file-item-sortable'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'

export interface FileListProps {
  ids: number[]
}

export default function FileList (props: FileListProps) {
  const { ids } = props
  const list = useRequest(fileListByIds, { manual: true })
  const [activeId, setActiveId] = useState(0)
  const [items, setItems] = useState<FileListByIdsRes[]>([])

  // dnd 相关
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  // 加载数据
  useEffect(() => {
    if (!ids?.length) return
    list.runAsync({ ids }).then(res => {
      setItems(res)
    })
  }, [ids])

  // 拖动事件监听
  const onDragStart = (e: DragStartEvent) => {
    setActiveId(Number(e.active.id || 0))
  }
  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over?.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
    setActiveId(0)
  }
  const onDragCancel = (e: DragCancelEvent) => {
    setActiveId(0)
  }

  // 空或者加载直接返回
  if (list.loading) return <SLoading />
  if (!list.data?.length) return null

  return (
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
            gridTemplateColumns: `repeat(${4}, 1fr)`,
            gridGap: 10,
            padding: 10
          }}
        >
          {
            items.map((item, index) => (
              <FileItemSortable index={index} key={item.id} path={item.path} k={item.id} />
            ))
          }
        </div>
      </SortableContext>

      <DragOverlay adjustScale={true}>
        <SRender render={activeId}>
          <FileItem
            path={items.find(item => item.id === activeId)?.path}
            index={items.findIndex(item => item.id === activeId)}
          />
        </SRender>
      </DragOverlay>
    </DndContext>
  )
}
