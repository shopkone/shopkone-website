import { useTranslation } from 'react-i18next'

import SCard from '@/components/s-card'
import VariantList from '@/pages/mange/product/product/product-change/variant-set/variant-list'
import VariantOptions from '@/pages/mange/product/product/product-change/variant-set/variant-options'

export default function VariantSet () {
  const { t } = useTranslation('product', { keyPrefix: 'product' })

  return (
    <SCard style={{ width: 612 }} title={t('变体设置')}>
      <VariantOptions />
      <VariantList />
    </SCard>
  )
}
