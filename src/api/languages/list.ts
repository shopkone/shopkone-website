import { api } from '@/api/api'

export interface LanguageListRes {
  id: number
  language: string
  is_default: boolean
  market_names: number[]
}

export const LanguageListApi = async () => {
  return await api<LanguageListRes[]>('/setting/language/list')
}
