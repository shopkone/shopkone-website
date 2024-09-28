import { api } from '@/api/api'
import { AddressType } from '@/api/common/address'

export interface LocationInfoReq {
  id: number
}

export interface LocationInfoRes {
  id: number
  name: string
  address: AddressType
  active: boolean
}

export const LocationInfoApi = async (params: LocationInfoReq) =>
  await api<LocationInfoRes>('/location/info', params)
