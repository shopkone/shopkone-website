import { api, PageReq, PageRes } from '@/api/api'

export interface InventoryListReq extends PageReq {
  location_id: number
}

export interface InventoryListRes {
  id: number
  quantity: number
}

export const InventoryListApi = async (params: InventoryListReq) => {
  return await api<PageRes<InventoryListRes[]>>('inventory/list', params)
}
