import { useRequest } from 'ahooks'
import axios from 'axios'

export const getLanguage = async (language: string, namespace: string) => {
  return await axios.get(`/public/locales/${language}/${namespace}.json`)
}

export const useLanguageApi = (language: string, namespace: string) => {
  return useRequest(
    getLanguage,
    { staleTime: -1, cacheKey: `${language}-${namespace}`, manual: true }
  )
}
