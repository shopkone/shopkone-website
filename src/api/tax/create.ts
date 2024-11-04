import { api } from '@/api/api'
import { TaxListRes } from '@/api/tax/list'

export interface TaxCreateReq {
  country_codes: string[]
}

export const TaxCreateApi = async (data: TaxCreateReq) => {
  return await api<{ list: TaxListRes[] }>('/tax/create', data)
}
