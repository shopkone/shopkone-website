import { useMemo } from 'react'
import classNames from 'classnames'

import { FileType } from '@/api/file/add-file-record'
import Image from '@/components/image'

import styles from './index.module.less'

export interface FileImageProps {
  src: string
  alt?: string
  width?: number | string
  height?: number | string
  type: FileType
  loading?: boolean
  padding?: number
  style?: React.CSSProperties
  className?: string
}

export default function FileImage (props: FileImageProps) {
  const { src, alt, width, height, type, loading, padding, style, className } = props

  const link = useMemo(() => {
    if (type === FileType.Image) {
      return src
    }
    if (type === FileType.Video) {
      return src
    }
    return src
  }, [type, src])

  return (
    <Image
      loading={loading}
      alt={alt}
      src={link}
      className={classNames(styles.img, className)}
      style={{ width, height, padding, ...style }}
    />
  )
}
