import { api } from '@/api/api'
import { SeoType } from '@/components/seo/edit'
import { InventoryPolicy, VariantStatus, VariantType } from '@/constant/product'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'

export interface ProductCreateReq {
  title: string
  description: string
  status: VariantStatus
  requires_shipping: boolean
  charge_tax_on_this_product: boolean
  spu: string
  vendor: string
  tags: string[]
  seo: SeoType
  variant_type: VariantType
  inventory_policy: InventoryPolicy
  file_ids: number[]
  variants: Variant[]
}
export interface ProductCreateRes {
  id: number
}

export const ProductCreateApi = async (data: ProductCreateReq) => {
  return await api<ProductCreateRes>('/product/create', data)
}
