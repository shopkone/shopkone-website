import { api } from '@/api/api'

export interface PurchaseMarkToOrderedReq {
  id: number
}

export const PurchaseMarkToOrderedApi = async (params: PurchaseMarkToOrderedReq) => {
  return await api('/purchase/mark-to-ordered', params)
}
