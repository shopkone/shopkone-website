import { api } from '@/api/api'

export interface RemoveAddressReq {
  address_id: number
}

export const RemoveAddressApi = async (params: RemoveAddressReq) => {
  return await api('customer/delete/address', params)
}
