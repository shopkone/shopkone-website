import { api } from '@/api/api'
import { MarketCreateReq } from '@/api/market/create'

export interface MarketUpdateReq extends MarketCreateReq {
  id: number
}

export interface MarketUpdateRes {
  remove_names: string[]
}

export const MarketUpdateApi = async (data: MarketUpdateReq) => {
  return await api<MarketUpdateRes>('/market/update', data, [8002])
}
