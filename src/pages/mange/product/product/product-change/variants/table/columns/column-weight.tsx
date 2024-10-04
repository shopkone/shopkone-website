import SInputNumber from '@/components/s-input-number'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'

export interface ColumnWeightProps {
  row: Variant
}

export default function ColumnWeight (row: ColumnWeightProps) {
  return (
    <div>
      <SInputNumber />
    </div>
  )
}
