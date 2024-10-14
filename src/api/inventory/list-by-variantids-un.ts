import { api } from '@/api/api'

export interface ListByVariantidsUnReq {
  ids: number[]
}

export interface ListByVariantidsUnRes {
  id: number
  location_id: number
  quantity: number
  variant_id: number
}

export const ListByVariantIdsUnApi = async (params: ListByVariantidsUnReq) =>
  await api<ListByVariantidsUnRes[]>('/inventory/list-un-by-variant-ids', params)
