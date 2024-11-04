import { api } from '@/api/api'

export const ShopTaxSwitchShippingApi = async () => {
  return await api<{ tax_shipping: boolean }>('/shop/tax/shipping/switch')
}
