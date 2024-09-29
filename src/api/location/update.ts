import { api } from '@/api/api'
import { AddressType } from '@/api/common/address'

export interface LocationUpdateReq {
  id: number
  name: string
  address: AddressType
  active: boolean
  fulfillment_details: boolean
}

export const UpdateLocationApi = async (params: LocationUpdateReq) => {
  return await api('/location/update', params)
}
