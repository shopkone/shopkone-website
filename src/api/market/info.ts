import { api } from '@/api/api'

export interface MarketInfoReq {
  id: number
}

export interface MarketInfoRes {
  id: number
  is_main: boolean
  name: string
  country_codes: string[]
}

export const MarketInfoApi = async (params: MarketInfoReq) => {
  return await api<MarketInfoRes>('/market/info', params)
}
