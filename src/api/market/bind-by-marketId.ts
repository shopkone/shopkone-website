import { api } from '@/api/api'

export interface BindByMarketIdReq {
  market_id: number
  language_ids: number[]
  default_language_id: number
}

export const BindByMarketIdApi = async (params: BindByMarketIdReq) =>
  await api('/market/bind-lang-by-market-id', params)
