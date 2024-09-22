import { useRequest } from 'ahooks'

import { api } from '@/api/api'

export interface CurrenciesRes {
  value: string
  label: string
}

const CurrenciesApi = async () => {
  return await api<CurrenciesRes[]>('/base/currencies')
}

export const useCurrencies = () => {
  return useRequest(CurrenciesApi, { staleTime: -1, cacheKey: '/base/currencies' })
}
