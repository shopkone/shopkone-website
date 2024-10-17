import { useEffect } from 'react'
import { initReactI18next, useTranslation } from 'react-i18next'
import i18next from 'i18next'

import { useLanguageApi } from '@/api/base/get-language'
import { useLayoutState } from '@/pages/mange/layout/state'

export const useLoadLanguage = (module: string) => {
  const { i18n, t } = useTranslation()
  const language = useLanguageApi('en', module)

  useEffect(() => {
    if (!language.data?.data) return
    i18n.addResources('en', module, language.data?.data)
  }, [language.data?.data])

  useEffect(() => {
    if (!module || (module === '/page/undefined')) return
    language.run('en', module)
  }, [module])

  return { language, t: (query: string) => t(query, { ns: module }) }
}

export const useI18n = () => {
  const t = useLayoutState(state => state.t)
  if (!t) return (v: string) => v
  return t
}

// 初始化 i18next
const i18n = i18next
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    interpolation: { escapeValue: false }
  })

export { i18n }
