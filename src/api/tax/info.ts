import { api } from '@/api/api'
import { TaxStatus } from '@/api/tax/list'

export interface BaseTax {
  id: number
  tax_rate: number
  has_note: boolean
  note: string
  status: TaxStatus
  country_code: string
  zones: BaseTaxZone[]
}

export interface BaseTaxZone {
  id: number
  name: string
  zone_code: string
  tax_rate: number
}

export interface TaxInfoReq {
  id: number
}

export interface TaxInfoRes extends BaseTax {
}

export const TaxInfoApi = async (params: TaxInfoReq) => {
  return await api<TaxInfoRes>('/tax/info', params)
}
