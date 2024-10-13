import { api } from '@/api/api'

export interface LocationExistInventoryReq {
  /**
   * 位置ID
   */
  id: number
}

export interface LocationExistInventoryRes {
  /**
   * 是否有库存
   */
  exist: boolean
}

export const LocationExistInventoryApi = async (params: LocationExistInventoryReq) => {
  return await api<LocationExistInventoryRes>('/location/exist-inventory', params)
}
