import { useTranslation } from 'react-i18next'

import Page from '@/components/page'

export default function TaxInfo () {
  const { t } = useTranslation('settings', { keyPrefix: 'tax' })
  return (
    <Page width={700} back={'/settings/taxes'}>
      asd
    </Page>
  )
}
