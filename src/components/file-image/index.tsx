import { useMemo } from 'react'
import { Image } from 'antd'
import classNames from 'classnames'

import { FileType } from '@/api/file/add-file-record'
import PhotoX from '@/assets/icon/photo-x.svg'
import SLoading from '@/components/s-loading'

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
  const { src, alt, width = 40, height = 40, type, loading = false, padding, style, className } = props

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
    <SLoading loading={loading}>
      <div className={styles.container}>
        <Image
          fallback={PhotoX as unknown as string}
          preview={false}
          alt={alt}
          src={link}
          width={width || style?.width}
          height={height || style?.height}
          className={classNames(styles.img, className)}
          style={{ width, height, padding, ...style }}
        />
      </div>
    </SLoading>
  )
}
