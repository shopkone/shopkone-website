import React, { CSSProperties, forwardRef, HTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox, Tag } from 'antd'
import classNames from 'classnames'

import { FileType } from '@/api/file/add-file-record'
import { FileListByIdsRes } from '@/api/file/file-list-by-ids'
import SRender from '@/components/s-render'

import styles from './index.module.less'

export interface FileItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  faded?: boolean
  style?: React.CSSProperties
  index: number
  dragging?: boolean
  bgDragging?: boolean
  onSelect: () => void
  select: boolean
  item?: FileListByIdsRes
  hasSelect?: boolean
}

const FileItem = (props: FileItemProps, ref: React.Ref<HTMLDivElement>) => {
  const { faded, style, index, dragging, bgDragging, onSelect, item, hasSelect, ...rest } = props
  const { t } = useTranslation('common', { keyPrefix: 'media' })
  const inlineStyles: CSSProperties = {
    opacity: faded ? '0.2' : '1',
    transformOrigin: '0 0',
    height: index === 0 ? 187 : 89.57,
    gridRowStart: index === 0 ? 'span 2' : undefined,
    gridColumnStart: index === 0 ? 'span 2' : undefined,
    backgroundImage: bgDragging ? '' : `url("${item?.cover || item?.path}")`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundColor: bgDragging ? '#e3e3e3' : '#fff',
    backgroundRepeat: 'no-repeat',
    borderColor: dragging ? '#bbb' : undefined,
    ...style
  }

  return (
    <div
      ref={ref}
      style={inlineStyles}
      {...rest}
      className={
        classNames(styles.file, dragging && styles.dragging, bgDragging && styles.bgDragging)
      }
    >
      <SRender
        style={{ cursor: hasSelect ? 'default' : undefined }}
        className={classNames(styles.mask, { [styles.checkedMask]: props.select })}
        render={!dragging}
      >
        <div
          onClick={e => {
            e.stopPropagation()
          }}
          style={{ cursor: 'default' }}
        >
          <Checkbox
            checked={props.select}
            onClick={() => {
              onSelect?.()
            }}
            style={{
              marginLeft: 4,
              marginTop: 4,
              cursor: 'default'
            }}
          />
        </div>
      </SRender>
      <SRender render={item?.type === FileType.Video} style={{ position: 'absolute', right: -4, bottom: 4 }}>
        <Tag style={{ fontWeight: 'bolder', background: '#d9e4ff', color: '#3478f5', borderColor: '#3478f5a0', borderRadius: 4 }}>
          <div>{t('视频1')}</div>
        </Tag>
      </SRender>
    </div>
  )
}

export default forwardRef(FileItem)
