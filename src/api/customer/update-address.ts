import { api } from '@/api/api'
import { AddressType } from '@/api/common/address'

export interface UpdateAddressReq {
  address: AddressType
  is_default: boolean
  customer_id: number
}

export const UpdateAddressApi = async (params: UpdateAddressReq) => {
  return await api('customer/update/address', params)
}
