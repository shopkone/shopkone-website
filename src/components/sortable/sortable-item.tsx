import { ReactNode } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import Item from '@/components/sortable/item'

export interface ItemSortableProps {
  index: number
  rowKey: number
  onClick?: () => void
  children: React.ReactNode

  className?: string
  draggingClassName?: string
  handle?: ReactNode
  style?: React.CSSProperties
}

export default function ItemSortable (props: ItemSortableProps) {
  const { rowKey, handle, children, style, ...rest } = props
  const sortable = useSortable({ id: rowKey })
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    transition
  } = sortable

  const s = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <Item
      ref={setNodeRef}
      style={{ ...style, ...s }}
      isDragging={isDragging}
      {...rest}
      {...attributes}
      {...(handle ? {} : listeners)}
    >
      {handle
        ? (
          <>
            <div {...listeners}>
              {handle}
            </div>
            {children}
          </>
          )
        : (
            children
          )}
    </Item>
  )
}
