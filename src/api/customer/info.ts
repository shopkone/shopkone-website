import { api } from '@/api/api'
import { AddressType } from '@/api/common/address'

export interface TaxFeeItem {
  country_code: string
  zones: string[]
  is_all: boolean
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
  phone?: string
  gender?: number
  birthday?: number
  address: AddressType[]
  tags?: string[]
  tax?: CustomerFreeTax
}

export const CustomerInfoApi = async (params: CustomerInfoReq) => {
  return await api<CustomerInfoRes>('/customer/info', params)
}
