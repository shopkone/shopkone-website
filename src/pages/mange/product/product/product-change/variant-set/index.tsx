import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import VariantList from '@/pages/mange/product/product/product-change/variant-set/variant-list'
import VariantOptions from '@/pages/mange/product/product/product-change/variant-set/variant-options'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'

export default function VariantSet () {
  const { t } = useTranslation('product', { keyPrefix: 'product' })
  const [variants, setVariants] = useState<Variant[]>([])

  return (
    <div style={{ width: 612 }}>
      <VariantOptions variants={variants} />
      <VariantList variants={variants} onChangeVariants={setVariants} />
    </div>
  )
}
