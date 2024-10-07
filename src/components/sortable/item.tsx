import React, { CSSProperties, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface ItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  faded?: boolean
  style?: React.CSSProperties
  isDragging?: boolean
  draggingClassName?: string
}

const Item = (props: ItemProps, ref: React.Ref<HTMLDivElement>) => {
  const { faded, style, isDragging, className, draggingClassName, ...rest } = props
  const inlineStyles: CSSProperties = { opacity: faded ? '0.2' : '1', transformOrigin: '0 0', ...style }

  return (
    <div ref={ref} style={inlineStyles} {...rest} className={classNames(className, isDragging && draggingClassName)} />
  )
}

export default forwardRef(Item)
