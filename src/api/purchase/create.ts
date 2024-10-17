import { api } from '@/api/api'
import { PurchaseItem } from '@/api/purchase/base'

export interface PurchaseCreateReq {
  supplier_id: number
  destination_id: number
  carrier_id?: number
  delivery_number?: string
  currency_code: string
  remarks?: string
  estimated_arrival?: number
  payment_terms?: number
  items: PurchaseItem[]
}

export interface PurchaseCreateRes {
  id: number
}

export const PurchaseCreateApi = async (params: PurchaseCreateReq) => {
  return await api<PurchaseCreateRes>('/purchase/create', params)
}
