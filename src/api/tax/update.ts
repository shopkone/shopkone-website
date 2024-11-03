import { api } from '@/api/api'
import { BaseTax, TaxInfoRes } from '@/api/tax/info'

export const TaxUpdateApi = async (params: BaseTax) => {
  return await api<TaxInfoRes>('/tax/update', params)
}
