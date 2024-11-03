import { api } from '@/api/api'
import { BaseTax } from '@/api/tax/info'

export const TaxUpdateApi = async (params: BaseTax) => {
  return await api('/tax/update', params)
}
