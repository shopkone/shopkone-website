import { HTMLAttributes, ReactNode, useEffect, useMemo, useState } from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { useRequest } from 'ahooks'
import classNames from 'classnames'

import { fileListByIds } from '@/api/file/file-list-by-ids'
import SLoading from '@/components/s-loading'

import styles from './index.module.less'

export interface FileListProps {
  ids: number[]
}

export default function FileList (props: FileListProps) {
  const { ids } = props
  const list = useRequest(fileListByIds, { manual: true })
  const [draggingId, setDraggingId] = useState(-1)

  const SortableItemElement = useMemo(() => SortableElement<HTMLAttributes<HTMLDivElement>>((p: HTMLAttributes<HTMLDivElement>) => (
    <div {...p}>
      asd
    </div>
  )), [draggingId])

  console.log({ draggingId })

  const SortableContainerElement = useMemo(() => SortableContainer<{ children: ReactNode }>(({ children }: { children: ReactNode }) => {
    return <div style={{ userSelect: 'none' }}>{children}</div>
  }), [])

  useEffect(() => {
    if (!ids?.length) return
    list.run({ ids })
  }, [ids])

  if (list.loading) {
    return (
      <div style={{ marginTop: 24 }}>
        <SLoading />
      </div>
    )
  }

  return (
    <div className={styles.fileList}>
      <SortableContainerElement
        hideSortableGhost={false}
        onSortEnd={e => {
          setDraggingId(-1)
        }}
        onSortOver={e => {

        }}
        onSortStart={e => {
          const item = list.data?.find((i, index) => index === e.index)
          setDraggingId(item?.id ?? -1)
        }}
        axis={'xy'}
      >
        {
          list.data?.map((i, index) => (
            <div className={classNames(styles.item, index === 0 && styles.itemBig)} key={i.id}>
              <SortableItemElement
                key={`item-${i.id}`}
                index={index}
                className={
                classNames(
                  styles['item-real'],
                  draggingId === i.id && styles.dragging

                )
                }
              >
                asd
              </SortableItemElement>

              <div className={styles['item-bg']}>
                123
              </div>
            </div>
          ))
        }
      </SortableContainerElement>
    </div>
  )
}
