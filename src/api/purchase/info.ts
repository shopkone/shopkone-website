import { api } from '@/api/api'
import { PurchaseCreateReq } from '@/api/purchase/create'

export enum PurchaseStatus {
  Draft = 1, // 草稿
  Ordered = 2, // 已下单
  PartialReceived = 3, // 部分收货
  Received = 4, // 已收货
  Closed = 5 // 关闭
}

export interface PurchaseInfoReq {
  id: number
}

export interface PurchaseInfoRes extends PurchaseCreateReq {
  id: number
  status: PurchaseStatus
  order_number: string
}

export const PurchaseInfoApi = async (params: PurchaseInfoReq) => {
  return await api<PurchaseInfoRes>('/purchase/info', params)
}
