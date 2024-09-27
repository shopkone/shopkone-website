import { api } from '@/api/api'

export interface GetShopInfoResponse {
  uuid: string
  store_name: string
  status: number
  website_favicon?: string
  store_currency: string
  time_zone: string
}

// 获取店铺信息
export const GetShopInfoApi = async () => {
  return await api<GetShopInfoResponse>('/shop/info')
}
