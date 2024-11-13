import { api } from '@/api/api'

export interface MarketSimpleReq {
  id: number
}
export interface MarketSimpleRes {
  name: string
  is_main: boolean
}

export const MarketSimpleApi = async (params: MarketSimpleReq) => {
  return await api<MarketSimpleRes>('/market/simple', params)
}
