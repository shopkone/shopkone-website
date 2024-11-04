import { api } from '@/api/api'

export const ShopTaxSwitchShippingUpdateApi = async (params: { tax_shipping: boolean }) => {
  return await api('/shop/tax/shipping/update', params)
}
