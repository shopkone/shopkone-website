import { useMemo } from 'react'
import { IconArrowLeft, IconArrowRight, IconGripVertical, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react'
import { Flex } from 'antd'
import classNames from 'classnames'

import { NavItemType } from '@/api/online/navInfo'
import IconButton from '@/components/icon-button'
import SRender from '@/components/s-render'
import ItemSortable from '@/components/sortable/sortable-item'
import { UseOpenType } from '@/hooks/useOpen'
import styles from '@/pages/mange/online/nav-list/change/index.module.less'

const DEFAULT_ITEM: NavItemType = {
  id: 0,
  levels: 0,
  parent_id: 0,
  title: '',
  url: ''
}

export interface NavItemProps {
  item: NavItemType
  openInfo: UseOpenType<NavItemType>
  isBg?: boolean
  style?: React.CSSProperties
  links: NavItemType[]
}

export default function Item (props: NavItemProps) {
  const { item, openInfo, isBg, style, links } = props

  const renderRight = useMemo(() => {
    if (item.levels === 3) return false
    if (links?.[0]?.levels === 3) return false
    return true
  }, [item, links])

  return (
    <div key={item.id}>
      <ItemSortable
        handle={
          <IconButton className={styles.btn} size={24} type={'text'}>
            <IconGripVertical size={15} />
          </IconButton>
        }
        style={style}
        className={classNames(styles.item, { [styles.bg]: isBg })}
        draggingClassName={styles.dragging} index={item.id} rowKey={item.id}
      >
        <IconButton type={'text'} size={24}>
          <IconArrowLeft size={15} />
        </IconButton>
        <SRender render={renderRight}>
          <IconButton style={{ marginRight: 8 }} type={'text'} size={24}>
            <IconArrowRight size={15} />
          </IconButton>
        </SRender>
        <div>{item.title}</div>
        <Flex justify={'flex-end'} flex={1} gap={8}>
          <SRender render={item.levels !== 3}>
            <IconButton
              onClick={() => {
                openInfo.edit({
                  ...DEFAULT_ITEM,
                  parent_id: item.id,
                  levels: item.levels + 1
                })
              }} size={24} type={'text'}
            >
              <IconPlus size={16} />
            </IconButton>
          </SRender>
          <IconButton
            onClick={() => {
              openInfo.edit(item)
            }} size={24} type={'text'}
          >
            <IconPencil size={15} />
          </IconButton>
          <IconButton size={24} type={'text'} danger>
            <IconTrash size={15} />
          </IconButton>
        </Flex>
      </ItemSortable>
    </div>
  )
}
