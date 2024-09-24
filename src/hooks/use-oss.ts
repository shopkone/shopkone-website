import { useRef } from 'react'
import { useMemoizedFn, useMount, useRequest } from 'ahooks'
import OSS from 'ali-oss'

import { GetUploadTokenApi } from '@/api/file/get-upload-token'
import { useGetShopInfo } from '@/api/shop/get-shop-info'

export const useOss = () => {
  const REGION = 'oss-cn-shenzhen' // 存储区域
  const BUCKET = 'shopkone' // 存储空间

  const client = useRef<OSS>(null)

  const getToken = useRequest(GetUploadTokenApi, { manual: true })
  const getShopInfo = useGetShopInfo(true)

  const fetToken = useMemoizedFn(async () => {
    const { token } = await getToken.runAsync()
    const { id: accessKeyId, secret: accessKeySecret, token: stsToken } = JSON.parse(window.atob(token))
    return { accessKeyId, accessKeySecret, stsToken }
  })

  const run = async (fileName: string, file: File, onProgress?: (p: number) => void) => {
    if (!client?.current) return

    const shopInfo = await getShopInfo.runAsync()

    const name = `${shopInfo?.uuid}/${fileName}`

    let abortCheckpoint: OSS.Checkpoint | undefined

    const ret = await client.current.multipartUpload(name, file, {
      checkpoint: abortCheckpoint,
      progress: (p, cpt, res) => {
        abortCheckpoint = cpt
        onProgress?.(p)
      }
    })
    return { url: (ret.res as any)?.requestUrls?.[0]?.split('?')?.[0] }
  }

  useMount(async () => {
    const key = await fetToken()
    // @ts-expect-error
    client.current = new OSS({
      region: REGION,
      ...key,
      bucket: BUCKET,
      refreshSTSToken: fetToken,
      timeout: 60 * 60 * 1000
    })
  })

  return { run }
}
