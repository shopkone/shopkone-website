import { api } from '@/api/api'

export enum TaxStatus {
  Active = 1,
  Deactive = 2
}

export interface TaxListRes {
  id: number
  tax_rate: number
  country_code: string
  status: TaxStatus
}

export const TaxListApi = async () => {
  return await api<TaxListRes[]>('/tax/list')
}
