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
  disabled?: boolean
}

export default function ItemSortable (props: ItemSortableProps) {
  const { rowKey, handle, children, disabled, style, ...rest } = props
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
    transform: disabled ? undefined : CSS.Transform.toString(transform),
    transition
  }

  return (
    <Item
      ref={disabled ? undefined : setNodeRef}
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
