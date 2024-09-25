import { ImgHTMLAttributes, useEffect, useState } from 'react'
import { ErrorPicture } from '@icon-park/react'
import { Flex } from 'antd'

import SLoading from '@/components/s-loading'

export interface ImageProps extends Omit<ImgHTMLAttributes<any>, 'loading'> {
  loading?: boolean
  size?: 'small' | 'large'
  errorSize?: number
}

export default function Image (props: ImageProps) {
  const { loading = false, size, errorSize = 18, src, ...rest } = props
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
          <Flex className={'fit-height fit-width'} align={'center'} justify={'center'} {...rest}>
            <ErrorPicture style={{ position: 'relative', top: 2 }} theme={'outline'} size={errorSize} fill={'#f54a45'} />
          </Flex>
          )
        : (
          <img
            alt={src}
            src={src}
            onLoadCapture={() => {
              setIsLoading(false)
            }}
            onLoad={() => { setIsLoading(false) }}
            onError={() => { setHasError(true); setIsLoading(false) }}
            {...rest}
          />
          )}
    </SLoading>
  )
}
