import { useRequest } from 'ahooks'

import { api } from '@/api/api'

interface GetShopInfoResponse {
  uuid: string
  name: string
  status: number
  favicon?: string
  currency_code: string
  time_zone_abbr: string
}

// 获取店铺信息
const GetShopInfoApi = async () => {
  return await api<GetShopInfoResponse>('/shop/info')
}

export const useGetShopInfo = (manual = false) => {
  const second = 1000
  return useRequest(GetShopInfoApi, { staleTime: second * 10, cacheKey: 'SHOP_INFO', manual })
}
