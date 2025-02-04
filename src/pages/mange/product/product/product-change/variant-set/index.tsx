import { useTranslation } from 'react-i18next'

import { Variant } from '@/pages/mange/product/product/product-change/variant-set/state'
import VariantList from '@/pages/mange/product/product/product-change/variant-set/variant-list'
import VariantOptions from '@/pages/mange/product/product/product-change/variant-set/variant-options'

export interface VariantSetProps {
  value?: Variant[]
  onChange?: (variants: Variant[]) => void
}

export default function VariantSet (props: VariantSetProps) {
  const { value, onChange } = props
  const { t } = useTranslation('product', { keyPrefix: 'product' })

  return (
    <div style={{ width: 612 }}>
      <VariantOptions variants={value || []} />
      <VariantList variants={value || []} onChangeVariants={onChange} />
    </div>
  )
}
