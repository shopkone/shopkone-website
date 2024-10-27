import { api } from '@/api/api'
import { BaseShipping } from '@/api/shipping/base'

export interface CreateShippingReq extends BaseShipping {
}
export interface CreateShippingRes {
  id: number
}

export const CreateShippingApi = async (data: CreateShippingReq) => {
  return await api<CreateShippingRes>('/shipping/create', data)
}
