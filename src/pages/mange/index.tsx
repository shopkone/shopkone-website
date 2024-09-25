import { Suspense, useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { useGetShopInfo } from '@/api/shop/get-shop-info'
import { useShopList } from '@/api/shop/get-shop-list'
import SLoading from '@/components/s-loading'
import { MangeRoutes } from '@/pages/mange/routes'
import Task from '@/pages/mange/task'

export default function Mange () {
  const shopList = useShopList()
  const shopId = window.location.pathname?.split('/')[1]
  const shop = useGetShopInfo(true)
  const [isInit, setIsInit] = useState(false)

  useEffect(() => {
    if (!shopList?.data?.length) return
    if (shopList.data?.find(item => item.uuid === shopId)) return // 如果可以找到，则不处理
    window.location.href = `/${shopList?.data?.[0]?.uuid}`
  }, [shopList.data])

  useEffect(() => {
    if (!shopList?.data?.length || shop.data || isInit) return
    setIsInit(true)
    if (!shopList.data?.find(item => item.uuid === shopId)) return
    shop.run()
  }, [shopId, shopList.data])

  const inShops = shopList.data?.find(item => item.uuid === shopId)
  if (!shopList.data || !inShops || !shopId || !shop.data?.uuid) return <SLoading />

  const router = createBrowserRouter(MangeRoutes, { basename: `/${shopId}` })

  return (
    <>
      <Task />
      <Suspense fallback={<SLoading />}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  )
}
