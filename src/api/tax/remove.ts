import { api } from '@/api/api'

export interface TaxRemoveReq {
  ids: number[]
}

export const TaxRemoveApi = async (params: TaxRemoveReq) => {
  await api('/tax/remove', params)
}
