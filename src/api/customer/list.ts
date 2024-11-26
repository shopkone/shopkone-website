import { api, PageReq, PageRes } from '@/api/api'
import { AddressType } from '@/api/common/address'

export interface CustomerListReq extends PageReq {
}

export interface CustomerListRes {
  id: number
  first_name: string
  last_name: string
  order_count: number
  cost_price: number
  email_subscribe: boolean
  email?: string
  phone?: string
  address?: AddressType
}

export const CustomerListApi = async (params: CustomerListReq) => {
  return await api<PageRes<CustomerListRes[]>>('/customer/list', params)
}
