import { useTranslation } from 'react-i18next'

import VariantList from '@/pages/mange/product/product/product-change/variant-set/variant-list'
import VariantOptions from '@/pages/mange/product/product/product-change/variant-set/variant-options'

export default function VariantSet () {
  const { t } = useTranslation('product', { keyPrefix: 'product' })

  return (
    <div style={{ width: 612 }}>
      <VariantOptions />
      <VariantList />
    </div>
  )
}
