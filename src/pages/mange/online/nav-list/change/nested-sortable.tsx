import { useState } from 'react'
import {
  closestCenter,
  DndContext,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core/dist/types'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useMemoizedFn, useThrottleFn } from 'ahooks'

import { NavItemType } from '@/api/online/navInfo'
import { UseOpenType } from '@/hooks/useOpen'
import AddModal from '@/pages/mange/online/nav-list/change/add-modal'
import SortableItem from '@/pages/mange/online/nav-list/change/sortable-item'

import styles from './index.module.less'

export interface NestedSortableProps {
  value?: NavItemType[]
  onChange?: (value: NavItemType[]) => void
  openInfo: UseOpenType<NavItemType>
}

export default function NestedSortable (props: NestedSortableProps) {
  const { value, onChange, openInfo } = props
  const [dragging, setDragging] = useState<NavItemType>()
  const [moving, setMoving] = useState<{ id: number, levels: number }>()

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
    setMoving(undefined)
    const { active, over } = e
    if (active.id !== over?.id) {
      const newIndex = value?.findIndex(i => i.id === over?.id)
      const oldIndex = value?.findIndex(i => i.id === active.id)
      onChange?.(arrayMove(value || [], oldIndex || 0, newIndex || 0))
    }
  })

  const onDragging = useThrottleFn((e: DragMoveEvent) => {
    if (!e.active?.id) return
    const item = value?.find(i => i.id === e.active.id)
    if (!item) return
    const x = e.delta.x + (item.levels - 1) * 24
    let levels = 1
    if (x < 18) {
      levels = 1
    } else if (x > 18 && x < 36) {
      levels = 2
    } else if (x > 36) {
      levels = 3
    }
    const children = value?.filter(i => i.parent_id === item.id)
    if (children?.length && levels === 3) {
      levels = 2
    }
    const grandson = value?.filter(i => children?.find(z => z.id === i.parent_id && i.levels === 3))
    console.log({ grandson })
    if (grandson?.length) {
      levels = 1
    }
    setMoving({ id: item.id, levels })
  }, { wait: 100 }).run

  const onDragStart = useMemoizedFn((e: DragStartEvent) => {
  })

  const onDragCancel = useMemoizedFn((e: DragMoveEvent) => {
    setMoving(undefined)
  })

  const onRemove = useMemoizedFn((id: number) => {
    onChange?.(value?.filter(i => i.id !== id) || [])
  })

  console.log({ moving })

  return (
    <div className={styles.card}>
      <DndContext
        onDragMove={onDragging}
        onDragStart={onDragStart}
        onDragCancel={onDragCancel}
        onDragEnd={onDragEnd}
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <SortableContext
          strategy={verticalListSortingStrategy}
          items={value || []}
        >
          {
            value?.map((item, index) => (
              <SortableItem
                moving={moving}
                info={openInfo}
                onRemove={onRemove}
                draggingItem={dragging}
                onDragging={setDragging}
                item={item}
                key={item.id}
                isLast={index === value?.length - 1}
              />
            ))
          }
        </SortableContext>

        <DragOverlay adjustScale={false}>
          <SortableItem
            isLast
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
    </div>
  )
}
