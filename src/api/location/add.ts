import { api } from '@/api/api'
import { AddressType } from '@/api/common/address'

export interface LocationAddReq {
  name: string
  address: AddressType
}

export interface LocationAddRes {
  id: number
}

export const LocationAddApi = async (params: LocationAddReq) => {
  return await api('location/add', params)
}
