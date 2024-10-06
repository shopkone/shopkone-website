import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { FileListByIdsRes } from '@/api/file/file-list-by-ids'
import FileItem from '@/components/media/file-item'

export interface FileItemSortableProps {
  index: number
  k: number
  onClick?: () => void
  onSelect: () => void
  select: boolean
  item: FileListByIdsRes
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

  return (
    <FileItem
      ref={setNodeRef}
      style={style}
      bgDragging={isDragging}
      {...props}
      {...attributes}
      {...listeners}
    />
  )
}
