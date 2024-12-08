import { useMemo, useState } from 'react'
import { DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core/dist/types'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { useMemoizedFn } from 'ahooks'

import { NavItemType } from '@/api/online/navInfo'
import { useOpen } from '@/hooks/useOpen'
import AddModal from '@/pages/mange/online/nav-list/change/add-modal'
import SortableItem from '@/pages/mange/online/nav-list/change/sortable-item'

export interface NestedSortableProps {
  value?: NavItemType[]
  onChange?: (value: NavItemType[]) => void
}

export default function NestedSortable (props: NestedSortableProps) {
  const { value, onChange } = props
  const [dragging, setDragging] = useState<NavItemType>()
  const openInfo = useOpen<NavItemType>()

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 8 } })
  )

  const onConfirm = (item: NavItemType) => {
    const find = value?.find(i => i.id === item.id)
    if (!find) {
      onChange?.([...(value || []), item])
    } else {
      onChange?.(value?.map(i => i.id === find.id ? item : i) || [])
    }
  }

  const onDragEnd = useMemoizedFn((e: DragEndEvent) => {
    const { active, over } = e
    if (active.id !== over?.id) {
      const newIndex = value?.findIndex(i => i.id === over?.id)
      const oldIndex = value?.findIndex(i => i.id === active.id)
      onChange?.(arrayMove(value || [], oldIndex || 0, newIndex || 0))
    }
  })

  const onRemove = useMemoizedFn((id: number) => {
    onChange?.(value?.filter(i => i.id !== id) || [])
  })

  const items = useMemo(() => (
    value?.filter(i => i.levels === 1).map(first => {
      const second = value?.filter(i => i.levels === 2 && i.parent_id === first.id).map(second => {
        const third = value?.filter(i => i.levels === 3 && i.parent_id === second.id)
        return { ...second, links: third }
      })
      return { ...first, links: second }
    }) || []
  ), [value])

  return (
    <>
      <DndContext onDragEnd={onDragEnd} sensors={sensors}>
        <SortableContext items={items || []}>
          {
            items.map(item => (
              <SortableItem
                info={openInfo}
                onRemove={onRemove}
                draggingItem={dragging}
                onDragging={setDragging}
                item={item} key={item.id}
              />
            ))
          }
        </SortableContext>

        <DragOverlay adjustScale={false}>
          <SortableItem
            info={openInfo}
            onRemove={() => {}}
            isBg
            draggingItem={dragging}
            onDragging={() => {}}
            item={dragging as any}
          />
        </DragOverlay>
      </DndContext>

      <AddModal info={openInfo} onConfirm={onConfirm} />
    </>
  )
}
