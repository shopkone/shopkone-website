import { api } from '@/api/api'
import { ShippingType } from '@/api/shipping/base'

export interface ShippingListRes {
  id: number
  name: string
  type: ShippingType
  product_count: number
  location_count: number
  zone_count: number
}

export const ShippingListApi = async () => {
  return await api<ShippingListRes[]>('/shipping/list')
}
