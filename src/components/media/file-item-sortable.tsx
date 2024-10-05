import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import FileItem from '@/components/media/file-item'

export interface FileItemSortableProps {
  path: string
  index: number
  k: number
}

export default function FileItemSortable (props: FileItemSortableProps) {
  const sortable = useSortable({ id: props.k })
  const {
    attributes,
    listeners,
    isDragging,
    setNodeRef,
    transform,
    transition
  } = sortable

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  if (isDragging) {
    console.log(props.index)
  }

  return (
    <FileItem
      ref={setNodeRef}
      style={style}
      {...props}
      {...attributes}
      {...listeners}
    />
  )
}
