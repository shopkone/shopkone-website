import { api } from '@/api/api'
import { AdjustType, MarketProductItem } from '@/api/market/update-market-price'

export interface MarketPriceInfoReq {
  market_id: number
}

export interface MarketPriceInfoRes {
  adjust_percent: number
  adjust_products: MarketProductItem[]
  adjust_type: AdjustType
  currency_code: string
  exchange_rate: number
  exchange_rate_time_stamp: number
}

export const MarketPriceInfoApi = async (params: MarketPriceInfoReq) =>
  await api<MarketPriceInfoRes>('/market/get-product', params)
