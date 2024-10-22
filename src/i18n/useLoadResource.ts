import { useEffect } from 'react'
import i18next from 'i18next'

import { Namespace, useLanguageApi } from '@/api/base/get-language'

export const useLoadResource = (namespace: Namespace) => {
  const lng = useLanguageApi(i18next.language, namespace)
  i18next.setDefaultNamespace(namespace)

  useEffect(() => {
    if (!namespace) return
    lng.run(i18next.language, namespace)
  }, [namespace])

  return lng
}
