import { api } from '@/api/api'
import { TaxListRes } from '@/api/tax/list'

export interface TaxActiveReq {
  id: number
  active: boolean
}

export const TaxActiveApi = async (params: TaxActiveReq) => {
  return await api<{ list: TaxListRes[] }>('/tax/active', params)
}
