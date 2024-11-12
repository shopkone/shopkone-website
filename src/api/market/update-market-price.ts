import { api } from '@/api/api'

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
  adjust_type: number
}

export const MarketUpdateProductApi = async (params: MarketUpdateProductReq) => {
  return await api('/market/update-product', params)
}
