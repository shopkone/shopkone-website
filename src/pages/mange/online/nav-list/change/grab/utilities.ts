import { arrayMove } from '@dnd-kit/sortable'

import { NavItemType } from '@/api/online/navInfo'

import type { FlattenedItem, TreeItems } from './types'

export const iOS = /iPad|iPhone|iPod/.test(navigator.platform)

function getDragDepth (offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth)
}

export function getProjection (
  items: FlattenedItem[],
  activeId: string,
  overId: string,
  dragOffset: number,
  indentationWidth: number
) {
  const overItemIndex = items.findIndex(({ id }) => id === overId)
  const activeItemIndex = items.findIndex(({ id }) => id === activeId)
  const activeItem = items[activeItemIndex]
  const newItems = arrayMove(items, activeItemIndex, overItemIndex)
  const previousItem = newItems[overItemIndex - 1]
  const nextItem = newItems[overItemIndex + 1]
  const dragDepth = getDragDepth(dragOffset, indentationWidth)
  const projectedDepth = activeItem.depth + dragDepth
  const maxDepth = getMaxDepth({
    previousItem,
    currentItem: newItems[overItemIndex]
  })
  const minDepth = getMinDepth({ nextItem })
  let depth = projectedDepth

  if (projectedDepth >= maxDepth) {
    depth = maxDepth
  } else if (projectedDepth < minDepth) {
    depth = minDepth
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() }

  function getParentId () {
    if (depth === 0 || !previousItem) {
      return null
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId
    }

    if (depth > previousItem.depth) {
      return previousItem.id
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId

    return newParent ?? null
  }
}

function getMaxDepth (
  { previousItem, currentItem }:
  { previousItem: FlattenedItem, currentItem: FlattenedItem }
) {
  let currentMax = 1
  if (currentItem?.links?.length) {
    currentMax = 2
    const hasNext = currentItem?.links?.some(i => i.links?.length)
    if (hasNext) {
      currentMax = 3
    }
  }
  console.log(currentMax, (previousItem?.depth))
  if (currentMax + (previousItem?.depth) > 2) {
    return previousItem.depth
  }
  if (previousItem) {
    return previousItem.depth + 1
  }

  return 0
}

function getMinDepth ({ nextItem }: { nextItem: FlattenedItem }) {
  if (nextItem) {
    return nextItem.depth
  }

  return 0
}

function flatten (
  items: TreeItems,
  parentId: string | null = null,
  depth = 0
): FlattenedItem[] {
  return items.reduce<FlattenedItem[]>((acc, item, index) => {
    return [
      ...acc,
      { ...item, parentId, depth, index },
      ...flatten(item.links, item.id, depth + 1)
    ]
  }, [])
}

export function flattenTree (items: TreeItems): FlattenedItem[] {
  return flatten(items)
}

export function buildTree (flattenedItems: FlattenedItem[]): TreeItems {
  const root: NavItemType = { id: 'root', links: [], title: '', url: '' }
  const nodes: Record<string, NavItemType> = { [root.id]: root }
  const items = flattenedItems.map((item) => ({ ...item, links: [] }))

  for (const item of items) {
    const { id, links, title, url } = item
    const parentId = item.parentId ?? root.id
    const parent = nodes[parentId] ?? findItem(items, parentId)

    nodes[id] = { id, links, title, url }
    parent.links.push(item)
  }

  return root.links
}

export function findItem (items: NavItemType[], itemId: string) {
  return items.find(({ id }) => id === itemId)
}

export function findItemDeep (
  items: TreeItems,
  itemId: string
): NavItemType | undefined {
  for (const item of items) {
    const { id, links } = item

    if (id === itemId) {
      return item
    }

    if (links.length) {
      const child = findItemDeep(links, itemId)

      if (child) {
        return child
      }
    }
  }

  return undefined
}

export function removeItem (items: TreeItems, id: string) {
  const newItems = []

  for (const item of items) {
    if (item.id === id) {
      continue
    }

    if (item.links.length) {
      item.links = removeItem(item.links, id)
    }

    newItems.push(item)
  }

  return newItems
}

export function setProperty<T extends keyof NavItemType> (
  items: TreeItems,
  id: string,
  property: T,
  setter: (value: NavItemType[T]) => NavItemType[T]
) {
  for (const item of items) {
    if (item.id === id) {
      item[property] = setter(item[property])
      continue
    }

    if (item.links.length) {
      item.links = setProperty(item.links, id, property, setter)
    }
  }

  return [...items]
}

function countChildren (items: NavItemType[], count = 0): number {
  return items.reduce((acc, { links }) => {
    if (links.length) {
      return countChildren(links, acc + 1)
    }

    return acc + 1
  }, count)
}

export function getChildCount (items: TreeItems, id: string) {
  if (!id) {
    return 0
  }

  const item = findItemDeep(items, id)

  return item ? countChildren(item.links) : 0
}

export function removeChildrenOf (items: FlattenedItem[], ids: string[]) {
  const excludeParentIds = [...ids]

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (item.links.length) {
        excludeParentIds.push(item.id)
      }
      return false
    }

    return true
  })
}
