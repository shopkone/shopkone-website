import { api, PageReq, PageRes } from '@/api/api'
import { VariantName } from '@/pages/mange/product/product/product-change/variants/state'

export interface ProductListReq extends PageReq {
  collections?: number[]
  tags?: string[]
  price_range?: { max: number | null, min: number | null }
  track_inventory?: number
}

export interface ProductListRes {
  id: number
  spu: string
  vendor: string
  created_at: number
  status: number
  title: string
  image: string
  inventory_tracking: boolean
  variants: Array<{
    id: number
    price: number
    quantity: number
    sku: string
    image: string
    name: VariantName[]
  }>
}

export const ProductListApi = async (data: ProductListReq) => {
  return await api<PageRes<ProductListRes[]>>('/product/list', data)
}
