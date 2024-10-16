import { api } from '@/api/api'
import { AddressType } from '@/api/common/address'

export interface SupplierListRes {
  id: number
  address: AddressType
}

export const SupplierListApi = async () => {
  return await api<SupplierListRes[]>('/product/supplier/list')
}
