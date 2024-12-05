import { api } from '@/api/api'

export const GetShopIdApi = async () => {
  return await api<{ shop_id: number }>('/shop/id')
}
