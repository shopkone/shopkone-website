import { api, PageReq, PageRes } from '@/api/api'

export interface InventoryListReq extends PageReq {
  location_id: number
}

export interface InventoryListRes {
  id: number
  quantity: number
  product_name: string
  variant_id: number
  name: string
  image: string
  sku: string
}

export const InventoryListApi = async (params: InventoryListReq) => {
  return await api<PageRes<InventoryListRes[]>>('inventory/list', params)
}
