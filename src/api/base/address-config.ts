import { api } from '@/api/api'

export interface PostalCodeConfigType {
  format: string
  regex: string
}

export interface AddressConfigReq {
  country: string
}

export interface AddressConfigRes {
  address1: string
  address2: string
  city: string
  company: string
  country: string
  first_name: string
  last_name: string
  phone: string
  postal_code: string
  zone: string
  postal_code_config?: PostalCodeConfigType
}

export const AddressConfigApi = async (params: AddressConfigReq) =>
  await api<AddressConfigRes>('/base/address-config', params)
