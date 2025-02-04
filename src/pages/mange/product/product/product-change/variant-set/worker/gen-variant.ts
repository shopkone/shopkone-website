import { Variant, VariantName } from '@/pages/mange/product/product/product-change/variants/state'
import { genId } from '@/utils/random'

export const genVariant = (name: VariantName[]): Variant => ({
  id: genId(),
  name,
  price: 0,
  weight_unit: 'kg',
  weight: null,
  compare_at_price: null,
  cost_per_item: null,
  inventories: [],
  tax_required: false,
  shipping_required: false,
  isParent: false
})
