import React, { CSSProperties, forwardRef, HTMLAttributes } from 'react'
import { Checkbox } from 'antd'
import classNames from 'classnames'

import SRender from '@/components/s-render'

import styles from './index.module.less'

export interface FileItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  faded?: boolean
  style?: React.CSSProperties
  path?: string
  index: number
  dragging?: boolean
  bgDragging?: boolean
  onSelect: () => void
  select: boolean
}

const FileItem = (props: FileItemProps, ref: React.Ref<HTMLDivElement>) => {
  const { faded, style, path, index, dragging, bgDragging, onSelect, ...rest } = props
  const inlineStyles: CSSProperties = {
    opacity: faded ? '0.2' : '1',
    transformOrigin: '0 0',
    height: index === 0 ? 187 : 89.57,
    gridRowStart: index === 0 ? 'span 2' : undefined,
    gridColumnStart: index === 0 ? 'span 2' : undefined,
    backgroundImage: bgDragging ? '' : `url("${path}")`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundColor: '#e3e3e3',
    borderColor: dragging ? '#bbb' : undefined,
    borderWidth: dragging && !index ? 2 : undefined,
    borderRadius: dragging && !index ? 16 : undefined,
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
        className={classNames(styles.mask, { [styles.checkedMask]: props.select })}
        render={!dragging}
      >
        <div onClick={e => { e.stopPropagation() }} style={{ cursor: 'default' }}>
          <Checkbox
            checked={props.select}
            onClick={() => { onSelect?.() }}
            style={{ marginLeft: 4, marginTop: 4, cursor: 'default' }}
          />
        </div>
      </SRender>
    </div>
  )
}

export default forwardRef(FileItem)
