import { useRequest } from 'ahooks'

import { http } from '@/http/http'

export interface LanguageRes {
  value: string
  label: string
}

const LanguageApi = async () => {
  return await http<LanguageRes[]>('/base/languages')
}

export const useLanguages = () => {
  return useRequest(LanguageApi, { staleTime: -1, cacheKey: '/language/list' })
}
