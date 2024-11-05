import { api } from '@/api/api'

export interface MarketCreateReq {
  name: string
  country_codes: string[]
}

export interface MarketCreateRes {
  id: number
  remove_names: string[]
}

export const MarketCreateApi = async (params: MarketCreateReq) => {
  return await api<MarketCreateRes>('/market/create', params, [8002])
}
