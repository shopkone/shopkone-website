import { api } from '@/api/api'
import { AddressType } from '@/api/common/address'

export interface LocationListReq {
  active?: boolean
}

export interface LocationListRes {
  id: number
  name: string
  address: AddressType
  active: boolean
  default: boolean
  order: number
}

export const LocationListApi = async (params?: LocationListReq): Promise<LocationListRes[]> => {
  return await api('/location/list', params)
}
