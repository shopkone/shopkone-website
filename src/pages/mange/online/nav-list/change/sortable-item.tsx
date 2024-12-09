import { useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import classNames from 'classnames'

import { NavItemType } from '@/api/online/navInfo'
import { UseOpenType } from '@/hooks/useOpen'

import styles from './index.module.less'

export interface SortableItemProps {
  item: NavItemType
  onDragging: (item?: NavItemType) => void
  draggingItem?: NavItemType
  style?: React.CSSProperties
  isBg?: boolean
  onRemove: (id: number) => void
  info: UseOpenType<NavItemType>
  isLast?: boolean
  moving?: { id: number, levels: number }
}

export const DEFAULT_ITEM = {
  id: 0,
  title: '',
  url: ''
}

export default function SortableItem (props: SortableItemProps) {
  const { info, item, draggingItem, style: propsStyle, isBg, onRemove, isLast, moving } = props
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item?.id })
  const style = {
    // @ts-expect-error
    transform: CSS.Transform.toString({ ...transform, scaleY: 1, scaleX: 1 }),
    transition
  }

  useEffect(() => {
    if (isDragging) {
      props.onDragging(item)
    } else {
      props.onDragging(undefined)
    }
  }, [isDragging])

  if (!item?.id) return null

  console.log(moving)
  const levels = isDragging ? moving?.levels : item.levels

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...propsStyle }}
      {...attributes}
      {...listeners}
      className={classNames(
        styles.item,
        { [styles.last]: isLast },
        { [styles.bgWrap]: isBg }
      )}
    >
      <div
        className={
        classNames(
          styles.inner,
          { [styles.bg]: isBg },
          { [styles.dragging]: isDragging }
        )
        }
        style={{ marginLeft: (levels || 0) * 24 }}
      >
        {item.title}
      </div>
    </div>
  )
}
