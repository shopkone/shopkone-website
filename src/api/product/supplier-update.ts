import { api } from '@/api/api'
import { AddressType } from '@/api/common/address'

export interface SupplierUpdateReq {
  id: number
  address: AddressType
}

export const SupplierUpdateApi = async (data: SupplierUpdateReq) => {
  return await api('/product/supplier/update', data)
}
