import { api } from '@/api/api'
import { PurchaseCreateReq } from '@/api/purchase/create'

export interface PurchaseInfoReq {
  id: number
}

export interface PurchaseInfoRes extends PurchaseCreateReq {
  id: number
}

export const PurchaseInfoApi = async (params: PurchaseInfoReq) => {
  return await api<PurchaseInfoRes>('/purchase/info', params)
}
