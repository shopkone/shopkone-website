import { useRequest } from 'ahooks'

import { api } from '@/api/api'

const LanguagesApi = async () => {
  return await api<string[]>('/base/language-list')
}

export const useLanguageList = () => {
  return useRequest(LanguagesApi, { staleTime: -1, cacheKey: 'LANGUAGE_LIST' })
}
