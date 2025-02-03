import { useTranslation } from 'react-i18next'

import SCard from '@/components/s-card'

import styles from './index.module.less'

export default function VariantOptions () {
  const { t } = useTranslation('product', { keyPrefix: 'product' })

  return (
    <SCard
      title={t('变体设置')}
      className={styles.card}
    >
      asd
    </SCard>
  )
}
