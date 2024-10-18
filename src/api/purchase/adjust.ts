import { api } from '@/api/api'

export interface PurchaseAdjustReceiveItem {
  id: number
  rejected_count: number
  received_count: number
}

export interface PurchaseAdjustReceiveReq {
  id: number
  items: PurchaseAdjustReceiveItem[]
}

export const PurchaseAdjustReceiveApi = async (params: PurchaseAdjustReceiveReq) => {
  return await api('/purchase/adjust-receive', params)
}
