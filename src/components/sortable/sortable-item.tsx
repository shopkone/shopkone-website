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
}

export default function ItemSortable (props: ItemSortableProps) {
  const sortable = useSortable({ id: props.rowKey })
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    transition
  } = sortable

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <Item
      ref={setNodeRef}
      style={style}
      isDragging={isDragging}
      {...props}
      {...attributes}
      {...listeners}
    />
  )
}
