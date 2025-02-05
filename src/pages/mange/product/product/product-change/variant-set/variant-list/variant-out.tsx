import { Variant } from '@/pages/mange/product/product/product-change/variant-set/state'
import VariantList from '@/pages/mange/product/product/product-change/variant-set/variant-list/index'

export interface VariantProps {
  value?: Variant[]
  onChange?: (variants: Variant[]) => void
}

export default function VariantOut (props: VariantProps) {
  const { value, onChange } = props

  return (
    <div>
      <VariantList variants={value || []} onChangeVariants={onChange} />
    </div>
  )
}
