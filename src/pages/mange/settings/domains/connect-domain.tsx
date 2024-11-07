import { useTranslation } from 'react-i18next'

import SModal from '@/components/s-modal'

export default function ConnectDomain () {
  const { t } = useTranslation('settings', { keyPrefix: 'domains' })

  return (
    <SModal width={700} title={t('连接已有域名')} open>
      asd
    </SModal>
  )
}
