import { CSSProperties } from 'react'
import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { iOS } from '../utilities'

import { Props as TreeItemProps, TreeItem } from './tree-item'

interface Props extends Omit<TreeItemProps, 'id'> {
  id: string
  title: string
  firstLevelsCount: number
}

const animateLayoutChanges: AnimateLayoutChanges = ({ isSorting, wasDragging }) =>
  !(isSorting || wasDragging)

export function SortableTreeItem ({ id, depth, title, firstLevelsCount, ...props }: Props) {
  const {
    attributes,
    isDragging,
    isSorting,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition
  } = useSortable({
    id,
    animateLayoutChanges
  })
  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition
  }

  return (
    <TreeItem
      ref={setDraggableNodeRef}
      wrapperRef={setDroppableNodeRef}
      style={style}
      depth={depth}
      ghost={isDragging}
      disableSelection={iOS}
      disableInteraction={isSorting}
      handleProps={{
        ...attributes,
        ...listeners
      }}
      firstLevelsCount={firstLevelsCount}
      title={title}
      {...props}
    />
  )
}
