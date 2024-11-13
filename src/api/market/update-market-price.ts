import { api } from '@/api/api'

export enum AdjustType {
  PriceAdjustmentTypeReduce = 1, // 减少
  PriceAdjustmentTypeIncrease = 2 // 增加
}

export interface MarketProductItem {
  id: number
  product_id: number
  fixed?: number
  exclude: boolean
}

export interface MarketUpdateProductReq {
  market_id: number
  adjust_products: MarketProductItem[]
  adjust_percent: number
  adjust_type: AdjustType
}

export const MarketUpdateProductApi = async (params: MarketUpdateProductReq) => {
  return await api('/market/update-product', params)
}
