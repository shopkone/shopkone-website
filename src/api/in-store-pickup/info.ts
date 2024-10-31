import { api } from '@/api/api'

export enum InStorePickupStatus {
  Open = 1,
  Close = 2
}

export enum InStorePickupTimeUnit {
  Minute = 1, // 分钟
  Hour = 2, // 小时
  Day = 3 // 天
}

export interface BaseInStorePickUp {
  id: number
  status: InStorePickupStatus
  is_unified: boolean
  pickup_eta: number | null
  pickup_eta_unit: InStorePickupTimeUnit
  weeks: BaseInStorePickUpBusinessHours[]
  location_id: number
  has_pickup_eta: boolean
  start: number
  end: number
  timezone: string
}

export interface BaseInStorePickUpBusinessHours {
  id: number
  week: number
  start: number
  end: number
  is_open: boolean
}

export interface InStorePickUpInfoReq {
  id: number
}

export const InStorePickUpInfoApi = async (params: InStorePickUpInfoReq) => {
  return await api<BaseInStorePickUp>('/delivery/in-store-pick-up/info', params)
}
