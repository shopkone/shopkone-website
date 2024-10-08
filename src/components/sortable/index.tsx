import { useMemo, useState } from 'react'
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
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useMemoizedFn } from 'ahooks'
import { Flex } from 'antd'

import SRender from '@/components/s-render'

type ItemType<T> = T & { id: number }

export interface SortableProps<T> {
  children: (items: Array<ItemType<T>>, id: number, isBg?: boolean) => React.ReactNode
  items: Array<ItemType<T>>
  onChange: (v: Array<ItemType<T>>) => void
  draggingClassName?: string
}

export default function Sortable<T> (props: SortableProps<T>) {
  const { children, items, onChange } = props

  const [activeId, setActiveId] = useState(0)

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 8 } })
  )

  const onDragStart = useMemoizedFn((e: DragStartEvent) => {
    setActiveId(Number(e.active.id || 0))
  })

  const onDragEnd = useMemoizedFn((e: DragEndEvent) => {
    const { active, over } = e
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(item => item.id === active.id)
      const newIndex = items.findIndex(item => item.id === over?.id)
      const list = arrayMove(items, oldIndex, newIndex)
      onChange(list)
    }
    setActiveId(0)
  })

  const onDragCancel = useMemoizedFn((e: DragCancelEvent) => {
    setActiveId(0)
  })

  const nodes = useMemo(() => children(items, activeId), [items, activeId])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
        <Flex vertical>
          {nodes}
        </Flex>
      </SortableContext>

      <DragOverlay adjustScale={true}>
        <SRender render={activeId}>
          {!!items.find(item => item.id === activeId) &&
            // @ts-expect-error
            children([items.find(item => item.id === activeId)], activeId, true)}
        </SRender>
      </DragOverlay>
    </DndContext>
  )
}
