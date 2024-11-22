import { api, PageReq, PageRes } from '@/api/api'

export interface CustomerListReq extends PageReq {
}

export interface CustomerListRes {
  id: number
  first_name: string
  last_name: string
  order_count: number
  cost_price: number
  email_subscribe: boolean
  country_info: string
  email?: string
  phone?: string
}

export const CustomerListApi = async (params: CustomerListReq) => {
  return await api<PageRes<CustomerListRes[]>>('/customer/list', params)
}
