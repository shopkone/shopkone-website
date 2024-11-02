import { api } from '@/api/api'

export enum TaxStatus {
  Active = 1,
  Inactive = 2
}

export enum CustomerTaxType {
  CustomerTaxTypeCollection = 1,
  CustomerTaxTypeDelivery = 2
}

export interface BaseTaxZone {
  id: number
  name: string
  zone_code: string
  tax_rate: number
}

export interface BaseCustomerTaxZone {
  id: number
  name: string
  area_code: string
  tax_rate: number
}

export interface BaseCustomerTax {
  id: number
  collection_id: number
  zones: BaseCustomerTaxZone[]
  type: CustomerTaxType
}

export interface BaseTax {
  id: number
  tax_rate: number
  has_note: boolean
  note: string
  status: TaxStatus
  country_code: string
  zones: BaseTaxZone[]
  customers: BaseCustomerTax[]
}

export interface TaxInfoReq {
  id: number
}

export interface TaxInfoRes extends BaseTax {
}

export const TaxInfoApi = async (params: TaxInfoReq) => {
  return await api<TaxInfoRes>('/tax/info', params)
}
