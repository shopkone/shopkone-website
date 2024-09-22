import { useRequest } from 'ahooks'

import { api } from '@/api/api'

export interface LanguageRes {
  value: string
  label: string
}

const LanguageApi = async () => {
  return await api<LanguageRes[]>('/base/languages')
}

export const useLanguages = () => {
  return useRequest(LanguageApi, { staleTime: -1, cacheKey: '/language/list' })
}
