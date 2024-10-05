import React, { CSSProperties, forwardRef, HTMLAttributes } from 'react'

export interface FileItemProps extends HTMLAttributes<HTMLDivElement> {
  faded?: boolean
  style?: React.CSSProperties
  path?: string
  index: number
}

const FileItem = (props: FileItemProps, ref: React.Ref<HTMLDivElement>) => {
  const { faded, style, path, index, ...rest } = props
  const inlineStyles: CSSProperties = {
    opacity: faded ? '0.2' : '1',
    transformOrigin: '0 0',
    height: index === 0 ? 410 : 200,
    gridRowStart: index === 0 ? 'span 2' : undefined,
    gridColumnStart: index === 0 ? 'span 2' : undefined,
    backgroundImage: `url("${path}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: 'grey',
    ...style
  }

  return <div ref={ref} style={inlineStyles} {...rest} />
}

export default forwardRef(FileItem)
