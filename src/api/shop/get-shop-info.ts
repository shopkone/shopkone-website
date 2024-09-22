import { useRequest } from 'ahooks'

import { api } from '@/api/api'

interface GetShopInfoResponse {
  uuid: string
  store_name: string
  status: number
  website_favicon?: string
  store_currency: string
  time_zone: string
}

// 获取店铺信息
const GetShopInfoApi = async () => {
  return await api<GetShopInfoResponse>('/shop/info')
}

export const useGetShopInfo = (manual = false) => {
  const second = 1000
  return useRequest(GetShopInfoApi, { staleTime: second * 10, cacheKey: 'SHOP_INFO', manual })
}
