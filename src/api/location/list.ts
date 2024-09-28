import { api } from '@/api/api'
import { AddressType } from '@/api/common/address'

export interface LocationListRes {
  name: string
  address: AddressType
  active: boolean
}

export const LocationListApi = async (): Promise<LocationListRes[]> => {
  return await api('/location/list')
}
