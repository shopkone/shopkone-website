import { api } from '@/api/api'

export interface SetLocationOrderItem {
  location_id: number
  order: number
}
export interface SetLocationOrderReq {
  items: SetLocationOrderItem[]
}

export const SetLocationOrder = async (params: SetLocationOrderReq) => {
  return await api('location/set-order', params)
}
