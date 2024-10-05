import { ReactNode, useEffect, useMemo, useState } from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { useRequest } from 'ahooks'

import { FileType } from '@/api/file/add-file-record'
import { fileListByIds, FileListByIdsRes } from '@/api/file/file-list-by-ids'
import FileImage from '@/components/file-image'
import SLoading from '@/components/s-loading'

import styles from './index.module.less'

export interface FileListProps {
  ids: number[]
}

export interface SortableElementProps {
  item: FileListByIdsRes
}

export default function FileList (props: FileListProps) {
  const { ids } = props
  const list = useRequest(fileListByIds, { manual: true })
  const [draggingIndex, setDraggingIndex] = useState(-1)

  const SortableItemElement = useMemo(() => SortableElement<SortableElementProps>((p: SortableElementProps) => (
    <FileImage src={p.item.path} type={FileType.Image} />
  )), [draggingIndex])

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
          setDraggingIndex(-1)
          console.log(e)
        }}
        onSortOver={e => {
          setDraggingIndex(e.oldIndex)
          console.log(e)
        }}
        axis={'xy'}
      >
        {
          list.data?.map((i, index) => (
            <SortableItemElement key={`item-${i.id}`} index={index} item={i} />
          ))
        }
      </SortableContainerElement>
    </div>
  )
}
