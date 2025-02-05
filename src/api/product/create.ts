import { api } from '@/api/api'
import { SeoType } from '@/components/seo/edit'
import { InventoryPolicy, VariantStatus, VariantType } from '@/constant/product'
import { Variant } from '@/pages/mange/product/product/product-change/variant-set/state'

export interface ProductCreateReq {
  title: string
  description: string
  status: VariantStatus
  spu: string
  vendor: string
  tags: string[]
  seo: SeoType
  variant_type: VariantType
  inventory_policy: InventoryPolicy
  file_ids: number[]
  variants: Variant[]
  scheduled_at: number
  inventory_tracking: number
  product_options: Array<{ label: string, value: string, image_id: number }>
}
export interface ProductCreateRes {
  id: number
}

export const ProductCreateApi = async (data: ProductCreateReq) => {
  return await api<ProductCreateRes>('/product/create', data)
}
