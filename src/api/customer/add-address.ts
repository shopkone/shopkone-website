import { api } from '@/api/api'
import { AddressType } from '@/api/common/address'

export interface AddAddressReq {
  customer_id: number
  address: AddressType
}

export const AddAddressApi = async (params: AddAddressReq) => {
  return await api<{ id: number }>('customer/add/address', params)
}
