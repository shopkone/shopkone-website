import { useEffect } from 'react'
import i18next from 'i18next'

import { useLanguageApi } from '@/api/base/get-language'

export const useChangeLng = (lng: string) => {
  const common = useLanguageApi(lng, 'common')

  useEffect(() => {
    if (!lng) return
    i18next.changeLanguage(lng).then(() => {
      common.run(lng, 'common')
    })
  }, [lng])

  return common
}
