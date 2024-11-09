import { api } from '@/api/api'

export interface MarketOptionsRes {
  label: string
  value: number
  is_main: boolean
  language_ids: number[]
  default_language_id: number
}

export const MarketOptionsApi = async () => {
  return await api<MarketOptionsRes[]>('/market/options')
}
