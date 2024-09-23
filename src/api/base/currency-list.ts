import { useRequest } from 'ahooks'

import { api } from '@/api/api'

export interface CurrencyListRes {
  /** 货币代码 */
  code: string
  /** 货币名称 */
  title: string
  /** 货币符号 */
  symbol: string
}

export const CurrencyListApi = async () => {
  return await api<CurrencyListRes[]>('/base/currency-list')
}

export const useCurrencyList = () => {
  return useRequest(CurrencyListApi, { staleTime: -1, cacheKey: 'CurrencyListApi' })
}
