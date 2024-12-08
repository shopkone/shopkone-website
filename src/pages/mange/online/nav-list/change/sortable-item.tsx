import { useEffect } from 'react'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { IconArrowLeft, IconArrowRight, IconGripVertical, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react'
import { Flex } from 'antd'
import classNames from 'classnames'

import { NavItemType } from '@/api/online/navInfo'
import IconButton from '@/components/icon-button'
import SRender from '@/components/s-render'
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
}

const DEFAULT_ITEM = {
  id: 0,
  title: '',
  url: ''
}

export default function SortableItem (props: SortableItemProps) {
  const { info, item, draggingItem, style: propsStyle, isBg, onRemove } = props
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const style = {
    // @ts-expect-error
    transform: CSS.Transform.toString({ ...transform, scaleY: 1, scaleX: 1 }),
    transition
  }

  const getIsLeftRender = (item: NavItemType) => {
    if (item.levels === 1) {
      return false
    }
    return true
  }

  const getIsRightRender = (item: NavItemType) => {
    if (item.levels === 3) {
      return false
    }
    if (item.links?.length) {
      return false
    }
    return true
  }

  useEffect(() => {
    if (isDragging) {
      props.onDragging(item)
    } else {
      props.onDragging(undefined)
    }
  }, [isDragging])

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...propsStyle }}
      {...attributes}
      {...listeners}
    >
      <Flex
        align={'center'}
        style={{
          marginLeft: (item.levels - 1) * 32,
          marginTop: item.levels !== 1 ? 0 : undefined
        }}
        gap={12}
        className={classNames(styles.item, { [styles.dragging]: isDragging, [styles.bg]: isBg })}
      >
        <div>
          <IconButton className={styles.btn} type={'text'} size={24}>
            <IconGripVertical size={15} />
          </IconButton>
        </div>
        <Flex gap={12} style={{ marginRight: 12 }} align={'center'}>
          <SRender render={getIsLeftRender(item)}>
            <IconButton type={'text'} size={24}>
              <IconArrowLeft size={14} />
            </IconButton>
          </SRender>
          <SRender render={getIsRightRender(item)}>
            <IconButton type={'text'} size={24}>
              <IconArrowRight size={14} />
            </IconButton>
          </SRender>
        </Flex>
        <div>
          {item.title}
        </div>
        <Flex gap={16} justify={'flex-end'} flex={1} align={'center'}>
          <SRender render={item.levels !== 3}>
            <IconButton onClick={() => { info.edit({ ...DEFAULT_ITEM, parent_id: item.id, levels: item.levels + 1 }) }} size={24} type={'text'}>
              <IconPlus size={16} />
            </IconButton>
          </SRender>
          <IconButton onClick={() => { info.edit(item) }} size={24} type={'text'}>
            <IconPencil size={15} />
          </IconButton>
          <IconButton onClick={() => { onRemove(item.id) }} danger size={24} type={'text'}>
            <IconTrash size={15} />
          </IconButton>
        </Flex>
      </Flex>
      {
        (item.parent_id !== draggingItem?.parent_id) && !!item?.links?.length && (
        <SortableContext strategy={verticalListSortingStrategy} items={item.links || []} >
          {
                item.links?.map(j => (
                  <SortableItem
                    info={info}
                    onRemove={onRemove}
                    draggingItem={draggingItem}
                    onDragging={props.onDragging}
                    key={j.id}
                    item={j}
                  />
                ))
              }
        </SortableContext>
        )
      }
    </div>
  )
}
