import { api } from '@/api/api'

export interface PurchaseRemoveReq {
  id: number
}

export const PurchaseRemoveApi = async (params: PurchaseRemoveReq) => {
  return await api('/purchase/remove', params)
}
