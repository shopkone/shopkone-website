import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  closestCenter,
  defaultDropAnimation,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  MeasuringStrategy,
  Modifier,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import cloneDeep from 'lodash/cloneDeep'

import { NavItemType } from '@/api/online/navInfo'
import { UseOpenType } from '@/hooks/useOpen'
import AddModal from '@/pages/mange/online/nav-list/change/add-modal'
import { SortableTreeItem } from '@/pages/mange/online/nav-list/change/grab/tree-item'

import { FlattenedItem, SensorContext } from './types'
import {
  buildTree,
  flattenTree,
  getChildCount,
  getProjection,
  removeChildrenOf,
  removeItem,
  setProperty
} from './utilities'

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always
  }
}

const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
  // @ts-expect-error
  dragSourceOpacity: 0.5
}

interface Props {
  collapsible?: boolean
  indentationWidth?: number
  indicator?: boolean
  removable?: boolean
  value?: NavItemType[]
  onChange?: (value: NavItemType[]) => void
  openInfo: UseOpenType<{ item?: NavItemType, isEdit: boolean }>
}

export function SortableTree ({
  collapsible,
  indicator,
  indentationWidth = 20,
  removable,
  value: items = [],
  onChange,
  openInfo
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [offsetLeft, setOffsetLeft] = useState(0)
  const [currentPosition, setCurrentPosition] = useState<{
    parentId: string | null
    overId: string
  } | null>(null)

  const setItems = (fn?: ((v: NavItemType[]) => NavItemType[])) => {
    const list = fn?.(items)
    onChange?.(cloneDeep(list) || [])
  }

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items)
    const collapsedItems = flattenedTree.reduce<string[]>(
      (acc, { links, collapsed, id }) =>
        collapsed && links.length ? [...acc, id] : acc,
      []
    )

    return removeChildrenOf(
      flattenedTree,
      activeId ? [activeId, ...collapsedItems] : collapsedItems
    )
  }, [activeId, items])
  const projected =
    activeId && overId
      ? getProjection(
        flattenedItems,
        activeId,
        overId,
        offsetLeft,
        indentationWidth
      )
      : null
  const sensorContext: SensorContext = useRef({
    items: flattenedItems,
    offset: offsetLeft
  })
  const sensors = useSensors(
    useSensor(PointerSensor)
  )

  const Change = (oldList: NavItemType[], item: NavItemType): NavItemType[] => {
    return oldList.map((navItem) => {
      if (navItem.id === item.id) {
        return item
      } else if (navItem.links && navItem.links.length > 0) {
        return { ...navItem, links: Change(navItem.links, item) }
      } else {
        return navItem
      }
    })
  }

  const onChangeItem = (r: { item?: NavItemType, isEdit: boolean }) => {
    const { item } = r
    if (!item) return
    if (!item.id && item?.links?.[0]) {
      onChange?.(cloneDeep([...items, item?.links?.[0]]))
      return
    }
    const newList = Change(items, item)
    onChange?.(cloneDeep(newList || []))
  }

  const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [
    flattenedItems
  ])
  const activeItem = activeId
    ? flattenedItems.find(({ id }) => id === activeId)
    : null

  useEffect(() => {
    sensorContext.current = {
      items: flattenedItems,
      offset: offsetLeft
    }
  }, [flattenedItems, offsetLeft])

  const announcements: any = {
    onDragStart (id: string) {
      return `Picked up ${id}.`
    },
    onDragMove (id: string, overId: string) {
      return getMovementAnnouncement('onDragMove', id, overId)
    },
    onDragOver (id: string, overId: string) {
      return getMovementAnnouncement('onDragOver', id, overId)
    },
    onDragEnd (id: string, overId: string) {
      return getMovementAnnouncement('onDragEnd', id, overId)
    },
    onDragCancel (id: string) {
      return `Moving was cancelled. ${id} was dropped in its original position.`
    }
  }

  return (
    <DndContext
      /* @ts-expect-error */
      announcements={announcements}
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        {flattenedItems.map(({ id, links, collapsed, depth, title, ...rest }) => (
          <SortableTreeItem
            onAdd={() => { openInfo.edit({ item: { id, title, links, ...rest }, isEdit: false }) }}
            onEdit={() => { openInfo.edit({ item: { id, title, links, ...rest }, isEdit: true }) }}
            firstLevelsCount={items.length || 0}
            title={title}
            key={id}
            id={id}
            value={id}
            depth={id === activeId && projected ? projected.depth : depth}
            indentationWidth={indentationWidth}
            indicator={indicator}
            collapsed={Boolean(collapsed && links.length)}
            onCollapse={
              collapsible && links.length
                ? () => { handleCollapse(id) }
                : undefined
            }
            onRemove={removable ? () => { handleRemove(id) } : undefined}
          />
        ))}
        {createPortal(
          <DragOverlay
            dropAnimation={dropAnimation}
            modifiers={indicator ? [adjustTranslate] : undefined}
          >
            {activeId && activeItem
              ? (
                <SortableTreeItem
                  firstLevelsCount={0}
                  id={activeId}
                  title={activeItem.title}
                  depth={activeItem.depth}
                  clone
                  childCount={getChildCount(items, activeId) + 1}
                  value={activeId}
                  indentationWidth={indentationWidth}
                />
                )
              : null}
          </DragOverlay>,
          document.body
        )}
      </SortableContext>

      <AddModal info={openInfo} onConfirm={onChangeItem} />
    </DndContext>
  )

  function handleDragStart ({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId.toString() || '')
    setOverId(activeId?.toString() || '')

    const activeItem = flattenedItems.find(({ id }) => id === activeId)

    if (activeItem) {
      setCurrentPosition({
        parentId: activeItem.parentId,
        overId: activeId?.toString() || ''
      })
    }

    document.body.style.setProperty('cursor', 'grabbing')
  }

  function handleDragMove ({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x)
  }

  function handleDragOver ({ over }: DragOverEvent) {
    setOverId(over?.id?.toString() ?? null)
  }

  function handleDragEnd ({ active, over }: DragEndEvent) {
    resetState()

    if (projected && over) {
      const { depth, parentId } = projected
      const clonedItems: FlattenedItem[] = JSON.parse(
        JSON.stringify(flattenTree(items))
      )
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id)
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id)
      const activeTreeItem = clonedItems[activeIndex]

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId }

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex)
      const newItems = buildTree(sortedItems)

      setItems(() => newItems)
    }
  }

  function handleDragCancel () {
    resetState()
  }

  function resetState () {
    setOverId(null)
    setActiveId(null)
    setOffsetLeft(0)
    setCurrentPosition(null)

    document.body.style.setProperty('cursor', '')
  }

  function handleRemove (id: string) {
    setItems((items) => removeItem(items, id))
  }

  function handleCollapse (id: string) {
    setItems((items) =>
      setProperty(items, id, 'collapsed', (value) => {
        return !value
      })
    )
  }

  function getMovementAnnouncement (
    eventName: string,
    activeId: string,
    overId?: string
  ) {
    if (overId && projected) {
      if (eventName !== 'onDragEnd') {
        if (
          currentPosition &&
          projected.parentId === currentPosition.parentId &&
          overId === currentPosition.overId
        ) {
          return
        } else {
          setCurrentPosition({
            parentId: projected.parentId,
            overId
          })
        }
      }

      const clonedItems: FlattenedItem[] = JSON.parse(
        JSON.stringify(flattenTree(items))
      )
      const overIndex = clonedItems.findIndex(({ id }) => id === overId)
      const activeIndex = clonedItems.findIndex(({ id }) => id === activeId)
      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex)

      const previousItem = sortedItems[overIndex - 1]

      let announcement
      const movedVerb = eventName === 'onDragEnd' ? 'dropped' : 'moved'
      const nestedVerb = eventName === 'onDragEnd' ? 'dropped' : 'nested'

      if (!previousItem) {
        const nextItem = sortedItems[overIndex + 1]
        announcement = `${activeId} was ${movedVerb} before ${nextItem.id}.`
      } else {
        if (projected.depth > previousItem.depth) {
          announcement = `${activeId} was ${nestedVerb} under ${previousItem.id}.`
        } else {
          let previousSibling: FlattenedItem | undefined = previousItem
          while (previousSibling && projected.depth < previousSibling.depth) {
            const parentId: string | null = previousSibling.parentId
            previousSibling = sortedItems.find(({ id }) => id === parentId)
          }

          if (previousSibling) {
            announcement = `${activeId} was ${movedVerb} after ${previousSibling.id}.`
          }
        }
      }

      return announcement
    }
  }
}

const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: transform.y - 25
  }
}
