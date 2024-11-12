import { api } from '@/api/api'
import { MarketProductItem } from '@/api/market/update-market-price'

export enum AdjustType {
  PriceAdjustmentTypeReduce = 1, // 减少
  PriceAdjustmentTypeIncrease = 2 // 增加
}

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
  adjust_type: AdjustType
  adjust_percent: number
  adjust_products: MarketProductItem[]
}

export const MarketInfoApi = async (params: MarketInfoReq) => {
  return await api<MarketInfoRes>('/market/info', params)
}
