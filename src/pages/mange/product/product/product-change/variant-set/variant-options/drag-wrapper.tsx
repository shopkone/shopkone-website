import { closestCenter, DndContext, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import type { DragCancelEvent, DragEndEvent } from '@dnd-kit/core/dist/types'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useMemoizedFn } from 'ahooks'

type ItemType<T> = T & { id: number }

export interface DragWrapperProps<T> {
  children: React.ReactNode
  onChange: (v: Array<ItemType<T>>) => void
  items: Array<ItemType<T>>
  setActiveId: (id: number) => void
  activeId: number
  draggingClassName?: string
}

export default function DragWrapper<T> (props: DragWrapperProps<T>) {
  const { children, items, onChange, setActiveId, activeId, draggingClassName } = props

  const onDragStart = useMemoizedFn((e: DragStartEvent) => {
    setActiveId?.(Number(e.active.id || -1))
  })

  const onDragEnd = useMemoizedFn((e: DragEndEvent) => {
    const { active, over } = e
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(item => item.id === active.id)
      const newIndex = items.findIndex(item => item.id === over?.id)
      const list = arrayMove(items, oldIndex, newIndex)
      onChange(list)
    }
    setActiveId?.(-1)
  })

  const onDragCancel = useMemoizedFn((e: DragCancelEvent) => {
    setActiveId?.(-1)
  })

  const activeItem = (children as any).find((item: any) => item.key === activeId?.toString())

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <SortableContext
        items={items.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>

      <DragOverlay adjustScale={false}>
        <div className={draggingClassName}>
          {activeItem}
        </div>
      </DragOverlay>
    </DndContext>
  )
}
