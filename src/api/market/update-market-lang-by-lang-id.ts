import { api } from '@/api/api'

export interface UpdateMarketLangByLangIdReq {
  lang_id: number
  market_ids: number[]
}

export const MarketUpdateLangByLangIdApi = async (params: UpdateMarketLangByLangIdReq) => {
  await api('/market/update-lang-by-lang-id', params)
}
