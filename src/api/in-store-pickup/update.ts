import { api } from '@/api/api'
import { BaseInStorePickUp } from '@/api/in-store-pickup/info'

export const InStorePickUpUpdateApi = async (params: BaseInStorePickUp) => {
  return await api('/delivery/in-store-pick-up/update', params)
}
