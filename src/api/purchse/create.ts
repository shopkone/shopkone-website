import { api } from '@/api/api'

export interface BasePurchaseItem {
  cost: number
  purchasing: number
  id?: number
  sku: string
  taxRate: number
  variant_id: number
}

export interface PurchaseCreateReq {
  supplier_id: number
  destination_id: number
  carrier_id?: number
  delivery_number?: string
  currency_code: string
  remarks?: string
  expected_arrival?: number
  payment_terms?: number
  items: BasePurchaseItem[]
}

export interface PurchaseCreateRes {
  id: number
}

export const PurchaseCreateApi = async (params: PurchaseCreateReq) => {
  return await api<PurchaseCreateRes>('/purchase/create', params)
}
