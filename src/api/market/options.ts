import { api } from '@/api/api'

export interface MarketOptionsRes {
  label: string
  value: number
  is_main: boolean
}

export const MarketOptionsApi = async () => {
  return await api<MarketOptionsRes[]>('/market/options')
}
