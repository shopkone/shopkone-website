import { useState } from 'react'
import { closestCenter, DndContext, DragStartEvent } from '@dnd-kit/core'
import type { DragCancelEvent, DragEndEvent } from '@dnd-kit/core/dist/types'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useMemoizedFn } from 'ahooks'

type ItemType<T> = T & { name: number }

export interface DragWrapperProps<T> {
  children: React.ReactNode
  onChange: (v: Array<ItemType<T>>) => void
  items: Array<ItemType<T>>
}

export default function DragWrapper<T> (props: DragWrapperProps<T>) {
  const { children, items, onChange } = props
  const [activeId, setActiveId] = useState(-1)

  const onDragStart = useMemoizedFn((e: DragStartEvent) => {
    setActiveId(Number(e.active.id || -1))
  })

  const onDragEnd = useMemoizedFn((e: DragEndEvent) => {
    const { active, over } = e
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(item => item.name === active.id)
      const newIndex = items.findIndex(item => item.name === over?.id)
      const list = arrayMove(items, oldIndex, newIndex)
      onChange(list)
    }
    setActiveId(-1)
  })

  const onDragCancel = useMemoizedFn((e: DragCancelEvent) => {
    setActiveId(-1)
  })

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <SortableContext
        items={items.map(item => item.name)}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  )
}
