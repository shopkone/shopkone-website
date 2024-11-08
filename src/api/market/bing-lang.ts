import { api } from '@/api/api'

export interface LanguageBindItem {
  market_id: number
  language_id: number
  is_default: number
}

export interface MarketBindLanReq {
  bind: LanguageBindItem[]
  un_bind: LanguageBindItem[]
}

export const MarketBindLangApi = async (params: MarketBindLanReq) => {
  await api('/market/bind-lang', params)
}
