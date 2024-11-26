import { api } from '@/api/api'

export interface CustomerOptionsRes {
  id: number
  email: string
  phone: string
  first_name: string
  last_name: string
}

export const CustomerOptionsApi = async () => {
  return await api<CustomerOptionsRes[]>('/customer/options')
}
