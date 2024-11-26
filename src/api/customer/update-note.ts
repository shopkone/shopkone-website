import { api } from '@/api/api'

export interface CustomerUpdateNoteReq {
  id: number
  note: string
}

export const CustomerUpdateNoteApi = async (params: CustomerUpdateNoteReq) => {
  return await api('/customer/update/note', params)
}
