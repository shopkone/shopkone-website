import { useEffect, useMemo, useState } from 'react'
import { useDebounce } from 'ahooks'
import { Image } from 'antd'
import classNames from 'classnames'

import { FileType } from '@/api/file/add-file-record'
import PhotoX from '@/assets/icon/photo-x.svg'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'

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
  size?: number
}

export default function FileImage (props: FileImageProps) {
  const { src, alt, width = 40, height = 40, type, loading = false, padding, style, className, size = 24 } = props
  const [imgLoading, setImgLoading] = useState(true)
  const [init, setInit] = useState<string>()

  const temp = useMemo(() => {
    if (type === FileType.Image) {
      return src
    }
    if (type === FileType.Video) {
      return src
    }
    return src
  }, [type, src])

  const link = useDebounce(temp, { wait: 150 })

  useEffect(() => {
    if (!link || (link === init)) {
      setImgLoading(false)
    } else if (!imgLoading) {
      setImgLoading(true)
    }
    setInit(link)
  }, [link])

  return (
    <SLoading size={size} loading={loading || imgLoading}>
      <div className={styles.container}>
        <SRender render={init}>
          <Image
            onError={() => { setImgLoading(false) }}
            onLoadCapture={() => { setImgLoading(false) }}
            onLoad={() => { setImgLoading(false) }}
            onLoadStart={() => { setImgLoading(true) }}
            fallback={PhotoX as unknown as string}
            preview={false}
            alt={alt}
            src={link}
            width={width || style?.width}
            height={height || style?.height}
            className={classNames(styles.img, className)}
            style={{ width, height, padding, ...style }}
          />
        </SRender>
      </div>
    </SLoading>
  )
}
