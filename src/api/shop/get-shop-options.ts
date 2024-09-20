import { useRequest } from 'ahooks'

import { api } from '@/api/api'

export interface GetShopOptionsResponse {
  uuid: string
  name: string
  status: number
  favicon?: string
}

// 获取店铺列表
const GetShopOptionsApi = async () => {
  return await api<GetShopOptionsResponse[]>('/shop/options')
}

export const useShopOptions = () => {
  const second = 1000
  return useRequest(GetShopOptionsApi, { staleTime: second * 10, cacheKey: 'SHOP_OPTIONS' })
}
