import { api } from '@/api/api'
import { AddressType } from '@/api/common/address'

export interface CreateSupplierReq {
  address: AddressType
}

export interface CreateSupplierRes {
  id: number
}

export const CreateSupplierApi = async (params: CreateSupplierReq) => {
  return await api<CreateSupplierRes>('/product/supplier/create', params)
}
