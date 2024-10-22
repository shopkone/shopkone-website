import { Suspense, useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { useShopList } from '@/api/shop/get-shop-list'
import SLoading from '@/components/s-loading'
import { MangeRoutes } from '@/pages/mange/routes'
import { useManageState } from '@/pages/mange/state'
import Task from '@/pages/mange/task'

export default function Mange () {
  const shopList = useShopList()
  const shopId = window.location.pathname?.split('/')[1]
  const manageState = useManageState()
  const [isInit, setIsInit] = useState(false)

  useEffect(() => {
    if (!shopList?.data?.length) return
    if (shopList.data?.find(item => item.uuid === shopId)) return // 如果可以找到，则不处理
    window.location.href = `/${shopList?.data?.[0]?.uuid}`
  }, [shopList.data])

  useEffect(() => {
    if (!shopList?.data?.length || manageState?.shopInfo || isInit) return
    setIsInit(true)
    if (!shopList.data?.find(item => item.uuid === shopId)) return
    manageState.setShopInfo()
  }, [shopId, shopList.data])

  const inShops = shopList.data?.find(item => item.uuid === shopId)
  if (!shopList.data || !inShops || !shopId || !manageState?.shopInfo?.uuid) return <SLoading />

  const router = createBrowserRouter(MangeRoutes, { basename: `/${shopId}` })

  return (
    <Suspense fallback={<SLoading />}>
      <Task />
      <RouterProvider router={router} />
    </Suspense>
  )
}
