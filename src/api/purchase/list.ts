import { api, PageReq, PageRes } from '@/api/api'
import { PurchaseStatus } from '@/api/purchase/info'

export interface PurchaseListReq extends PageReq {}

export interface PurchaseListRes {
  id: number
  order_number: string
  supplier_id: number
  destination_id: number
  status: PurchaseStatus
  to_be_receiving_quantity: number
  refused_quantity: number
  total: number
  expected_arrival: number
  purchasing: number
  received: number
  rejected: number
}

export const PurchaseListApi = async (params: PurchaseListReq) => {
  return await api<PageRes<PurchaseListRes[]>>('/purchase/list', params)
}
