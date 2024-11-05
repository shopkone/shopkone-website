import { api } from '@/api/api'

export interface LanguageCreateReq {
  codes: string[]
}

export const LanguageCreateApi = async (data: LanguageCreateReq) => {
  return await api('/setting/language/create', data)
}
