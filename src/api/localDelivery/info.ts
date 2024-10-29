import { api } from '@/api/api'
import { UpdateLocalDeliveryReq } from '@/api/localDelivery/update'

export interface LocalDeliveryInfoReq {
  id: number
}

export interface LocalDeliveryInfoRes extends UpdateLocalDeliveryReq {
  location_id: number
}

export const LocalDeliveryInfoApi = async (params: LocalDeliveryInfoReq) => {
  return await api<LocalDeliveryInfoRes>('/delivery/local-delivery/info', params)
}
