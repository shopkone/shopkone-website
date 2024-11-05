import { api } from '@/api/api'

export interface MarketListRes {
  is_main: boolean
  name: string
  country_codes: string[]
  id: number
}

export const MarketListApi = async () => {
  return await api<MarketListRes[]>('/market/list')
}
