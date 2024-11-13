import { api } from '@/api/api'

export interface MarketInfoReq {
  id: number
}

export interface MarketInfoRes {
  id: number
  is_main: boolean
  name: string
  country_codes: string[]
  domain_type: number
  domain_suffix: string
  sub_domain_id: number
  language_ids: number[]
  default_language_id: number
  currency_code: string
}

export const MarketInfoApi = async (params: MarketInfoReq) => {
  return await api<MarketInfoRes>('/market/info', params)
}
