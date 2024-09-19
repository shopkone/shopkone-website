import { useRequest } from 'ahooks'

import { http } from '@/http/http'

export interface CurrenciesRes {
  value: string
  label: string
}

const CurrenciesApi = async () => {
  return await http<CurrenciesRes[]>('/base/currencies')
}

export const useCurrencies = () => {
  return useRequest(CurrenciesApi, { staleTime: -1, cacheKey: '/base/currencies' })
}
