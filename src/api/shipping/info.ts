import { api } from '@/api/api'
import { BaseShipping } from '@/api/shipping/base'

export interface ShippingInfoReq {
  id: number
}

export const ShippingInfoApi = async (data: ShippingInfoReq) => {
  return await api<BaseShipping>('/shipping/info', data)
}
