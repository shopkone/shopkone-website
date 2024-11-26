import { api } from '@/api/api'
import { PhoneType } from '@/api/common/address'

export interface CustomerUpdateBaseReq {
  id: number
  first_name: string
  last_name: string
  language: string
  email: string
  phone: PhoneType
  gender: string
  birthday: number
}

export const customerUpdateBaseApi = async (params: CustomerUpdateBaseReq) => {
  return await api('/customer/update/base', params)
}
