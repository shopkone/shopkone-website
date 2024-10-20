import { api } from '@/api/api'

export interface TransferAdjustItem {
  variant_id: number
  rejected: number
  received: number
}

export interface TransferAdjustReq {
  id: number
  items: TransferAdjustItem[]
}

export const TransferAdjustApi = async (params: TransferAdjustReq) => {
  return await api('/transfer/adjust', params)
}
