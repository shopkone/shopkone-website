import { api } from '@/api/api'
import { BaseShipping } from '@/api/shipping/base'

export const ShippingUpdateApi = async (params: BaseShipping) => {
  await api('/shipping/update', params)
}
