import { useRequest } from 'ahooks'

import { api } from '@/api/api'

export interface GetShopListResponse {
  uuid: string
  name: string
  status: number
  favicon?: string
}

// 获取店铺列表
const GetShopListApi = async () => {
  return await api<GetShopListResponse[]>('/shop/list')
}

export const useShopList = () => {
  const second = 1000
  return useRequest(GetShopListApi, { staleTime: second * 10, cacheKey: 'SHOP_OPTIONS' })
}
