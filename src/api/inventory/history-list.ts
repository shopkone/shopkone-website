/*
type InventoryHistoryReq struct {
  g.Meta `path:"/inventory/history" method:"post" tags:"Inventory" summary:"库存历史记录"`
  Id     uint `json:"id" v:"required" dc:"库存id"`
}
type InventoryHistoryRes struct {
  Id           uint                     `json:"id"`
  DiffQuantity int                      `json:"diff_quantity"`
  Date         int64                    `json:"date"`
  Activity     mInventory.InventoryType `json:"activity"`
}
*/

import { api } from '@/api/api'

export interface HistoryListReq {
  id: number
}

export interface HistoryListRes {
  id: number
  diff_quantity: number
  date: number
  activity: number
}

export const HistoryListApi = async (params: HistoryListReq) => {
  return await api<HistoryListRes[]>('inventory/history', params)
}
