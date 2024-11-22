import { api } from '@/api/api'
import { AddressType, PhoneType } from '@/api/common/address'

export enum GenderType {
  Unknown = 0,
  Male = 1,
  Female = 2,
  Other = 3
}

export interface CustomerCreateReq {
  first_name: string
  last_name: string
  email: string
  note: string
  phone: PhoneType
  gender: GenderType
  birthday: number
  address: AddressType
}

export interface CustomerCreateRes {
  id: number
}

export const EMAIL_EXIST_CODE = 9002
export const PHONE_EXIST_CODE = 9003

export const CustomerCreateApi = async (params: CustomerCreateReq) => {
  return await api<CustomerCreateRes>('/customer/create', params)
}
