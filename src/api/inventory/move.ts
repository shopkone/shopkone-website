import { api } from '@/api/api'

export interface MoveReq {
  from: number
  to: number
}

export const InventoryMoveApi = async (params: MoveReq) => {
  await api('/inventory/move', params)
}
