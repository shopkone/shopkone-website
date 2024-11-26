import { api } from '@/api/api'
import { AddressType, PhoneType } from '@/api/common/address'

export interface TaxFeeItem {
  id: number
  country_code: string
  zones: string[]
}

export interface CustomerFreeTax {
  areas: TaxFeeItem[]
  free: boolean
  all: boolean
}

export interface CustomerInfoReq {
  id: number
}

export interface CustomerInfoRes {
  id: number
  first_name?: string
  last_name?: string
  email?: string
  note?: string
  phone?: PhoneType
  gender?: number
  birthday?: number
  address: AddressType[]
  tags?: string[]
  tax: CustomerFreeTax
  language?: string
  default_address_id?: number
}

export const CustomerInfoApi = async (params: CustomerInfoReq) => {
  return await api<CustomerInfoRes>('/customer/info', params)
}
