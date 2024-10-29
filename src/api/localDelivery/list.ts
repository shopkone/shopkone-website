import { api } from '@/api/api'

export interface LocalDeliveryListRes {
  id: number
  status: number
  location_id: number
}

export const LocalDeliveryListApi = async (): Promise<LocalDeliveryListRes[]> => {
  return await api('/delivery/local-delivery/list')
}
