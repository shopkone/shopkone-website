import { useMemo } from 'react'

import { FileType } from '@/api/file/add-file-record'
import Image from '@/components/image'

import styles from './index.module.less'

export interface FileImageProps {
  src: string
  alt?: string
  width?: number
  height?: number
  type: FileType
  loading?: boolean
}

export default function FileImage (props: FileImageProps) {
  const { src, alt, width, height, type, loading } = props

  const link = useMemo(() => {
    if (type === FileType.Image) {
      return src
    }
    if (type === FileType.Video) {
      return src
    }
    return ''
  }, [type, src])

  return (
    <Image
      loading={loading}
      alt={alt}
      src={link}
      className={styles.img}
      style={{ width, height }}
    />
  )
}
