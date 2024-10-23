import { initReactI18next } from 'react-i18next'
import i18next from 'i18next'
import httpI18n from 'i18next-http-backend'

export default i18next.use(httpI18n).use(initReactI18next).init({
  fallbackLng: false,
  debug: true,
  load: 'languageOnly',
  lng: 'zhCN',
  ns: [],
  interpolation: { escapeValue: false },
  react: { useSuspense: true }
})
