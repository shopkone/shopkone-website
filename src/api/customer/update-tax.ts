import { api } from '@/api/api'

export interface CustomerSetTaxItem {
  id: number
  country_code: string
  zones: string[]
}

export interface CustomerSetTaxReq {
  id: number
  areas: CustomerSetTaxItem[]
}

export const CustomerSetTaxApi = async (params: CustomerSetTaxReq) =>
  await api('customer/set/tax', params)
