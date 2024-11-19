import { api } from '@/api/api'

export interface GetExchangeRateReq {
  from: string
  to: string
}

export interface GetExchangeRateRes {
  rate: number
  timeStamp: number
}

export const GetExchangeRateApi = async (params: GetExchangeRateReq) => {
  return await api<GetExchangeRateRes>('/base/exchange-rate', params)
}
