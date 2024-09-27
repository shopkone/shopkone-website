import { api } from '@/api/api'
import { AddressType } from '@/api/common/address'

export interface ShopUpdateGeneralReq {
  store_name: string
  store_owner_email: string
  customer_service_email: string
  website_favicon: string
  store_currency: string
  currency_formatting: string
  timezone: string
  password: string
  password_protection: boolean
  password_message: string
  address: AddressType
}

export const UpdateGeneralApi = async (params: ShopUpdateGeneralReq) => {
  return await api('/shop/update/general', params)
}
