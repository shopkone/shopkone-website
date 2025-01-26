import { api, PageReq, PageRes } from '@/api/api'
import { FilterNumberRangeProps } from '@/components/table-filter/filter-number-range'
import { VariantStatus } from '@/constant/product'
import { VariantName } from '@/pages/mange/product/product/product-change/variants/state'

export interface ProductListReq extends PageReq {
  collections?: number[]
  tags?: string[]
  track_inventory?: number
  keyword?: string 
  type?: string
  collection_id?: number
  status: VariantStatus | 0
  price_range?: FilterNumberRangeProps['value']
  exclude_ids?: number[]
  include_ids?: number[]
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
