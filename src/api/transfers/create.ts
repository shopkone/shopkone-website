import { api } from '@/api/api'

export interface TransferItem {
  id: number
  quantity: number
  variant_id: number
}

export interface TransferCreateReq {
  origin_id: number
  destination_id: number
  items: TransferItem[]
  carrier_id?: number
  delivery_number?: string
  estimated_arrival?: number
}

export interface TransferCreateRes {
  id: number
}

export const TransferCreateApi = async (data: TransferCreateReq) => {
  return await api<TransferCreateRes>('/transfer/create', data)
}
