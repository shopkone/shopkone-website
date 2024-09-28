import { api } from '@/api/api'
import { AddressType } from '@/api/common/address'

export interface LocationListRes {
  id: number
  name: string
  address: AddressType
  active: boolean
  default: boolean
}

export const LocationListApi = async (): Promise<LocationListRes[]> => {
  return await api('/location/list')
}
