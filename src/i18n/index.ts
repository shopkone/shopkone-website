import { initReactI18next } from 'react-i18next'
import i18next from 'i18next'

export default i18next.use(initReactI18next).init({
  fallbackLng: false,
  debug: true,
  load: 'languageOnly',
  interpolation: { escapeValue: false },
  react: { useSuspense: true }
})
