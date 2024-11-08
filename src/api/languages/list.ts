import { api } from '@/api/api'

export interface LanguageListRes {
  id: number
  language: string
  is_default: boolean
  markets: Array<{ market_id: number, is_default: boolean }>
  is_active: boolean
}

export const LanguageListApi = async () => {
  return await api<LanguageListRes[]>('/setting/language/list')
}
