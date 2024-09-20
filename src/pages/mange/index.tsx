import { Suspense, useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { useGetShopInfo } from '@/api/shop/get-shop-info'
import { useShopOptions } from '@/api/shop/get-shop-options'
import SLoading from '@/components/s-loading'
import { MangeRoutes } from '@/pages/mange/routes'

export default function Mange () {
  const options = useShopOptions()
  const shopId = window.location.pathname?.split('/')[1]
  const shop = useGetShopInfo(true)
  const [isInit, setIsInit] = useState(false)

  useEffect(() => {
    if (!options?.data?.length) return
    if (options.data?.find(item => item.uuid === shopId)) return // 如果可以找到，则不处理
    window.location.href = `/${options?.data?.[0]?.uuid}`
  }, [options.data])

  useEffect(() => {
    if (!options?.data?.length || shop.data || isInit) return
    setIsInit(true)
    if (!options.data?.find(item => item.uuid === shopId)) return
    shop.run()
  }, [shopId, options.data])

  const inShops = options.data?.find(item => item.uuid === shopId)
  if (!options.data || !inShops || !shopId || !shop.data?.uuid) return <SLoading />

  const router = createBrowserRouter(MangeRoutes, { basename: `/${shopId}` })

  return (
    <Suspense fallback={<SLoading />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
