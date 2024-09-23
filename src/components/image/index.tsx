import { ImgHTMLAttributes, useEffect, useState } from 'react'
import { ErrorPicture } from '@icon-park/react'

import SLoading from '@/components/s-loading'

export interface ImageProps extends Omit<ImgHTMLAttributes<any>, 'loading'> {
  loading?: boolean
  size?: 'small' | 'large'
  errorSize?: number
}

export default function Image (props: ImageProps) {
  const { loading = true, size, errorSize = 18, src, ...rest } = props
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // 监控 src 的变化
  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
  }, [src])

  return (
    <SLoading size={size} loading={loading || isLoading}>
      {hasError
        ? (
          <ErrorPicture theme={'outline'} size={errorSize} fill={'#646a73'} />
          )
        : (
          <img
            src={src}
            onLoad={() => { setIsLoading(false) }}
            onError={() => { setHasError(true) }}
            loading={'lazy'}
            {...rest}
          />
          )}
    </SLoading>
  )
}
