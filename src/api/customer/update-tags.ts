import { api } from '@/api/api'

export interface CustomerUpdateTagsReq {
  id: number
  tags: string[]
}

export const CustomerUpdateTagsApi = async (params: CustomerUpdateTagsReq) => {
  return await api('/customer/update/tags', params)
}
