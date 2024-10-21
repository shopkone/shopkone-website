import { useEffect } from 'react'
import { initReactI18next, useTranslation } from 'react-i18next'
import i18next from 'i18next'

import { useLanguageApi } from '@/api/base/get-language'
import { useLayoutState } from '@/pages/mange/layout/state'

export const useLoadLanguage = (module: string) => {
  const { i18n, t } = useTranslation()
  const language = useLanguageApi('zh-CN', module)

  useEffect(() => {
    if (!language.data?.data) return
    i18n.addResources('zh-CN', module, language.data?.data)
  }, [language.data?.data])

  useEffect(() => {
    if (!module || (module === '/page/undefined')) return
    language.run('zh-CN', module)
  }, [module])

  return { language, t: (query: string, context?: any) => t(query, { ...(context || {}), ns: module }) as string }
}

export const useI18n = () => {
  const t = useLayoutState(state => state.t)
  if (!t) return (v: string, context?: any) => v
  return t
}

// 初始化 i18next
const i18n = i18next
  .use(initReactI18next)
  .init({
    fallbackLng: 'zh-CN',
    lng: 'zh-CN',
    interpolation: { escapeValue: false },
    debug: true
  })

export { i18n }
