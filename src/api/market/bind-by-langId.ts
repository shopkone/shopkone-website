import { api } from '@/api/api'

export interface MarketBindLangByLangIdReq {
  market_ids: number[]
  language_id: number
}

export const MarketBindLangByLangIdApi = async (params: MarketBindLangByLangIdReq) => {
  await api('/market/bind-lang-by-lang-id', params)
}
