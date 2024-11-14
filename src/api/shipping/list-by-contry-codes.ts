import { api } from '@/api/api'
import { BaseShippingZone } from '@/api/shipping/base'

export interface ShippingZoneListByCountriesReq {
  country_codes: string[]
}

export interface ShippingZoneListByCountriesRes {
  zones: BaseShippingZone[]
}

export const ShippingZoneListApi = async (params: ShippingZoneListByCountriesReq) =>
  await api<ShippingZoneListByCountriesRes>('/shipping/zone/list-by-countries', params)
