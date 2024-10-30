import { api } from '@/api/api'

export interface InStorePickUpListRes {
  id: number
  status: number
  location_id: number
}

export const InStorePickUpListApi = async () => {
  return await api<InStorePickUpListRes[]>('/delivery/in-store-pick-up/list')
}
