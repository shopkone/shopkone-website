import { api, PageReq, PageRes } from '@/api/api'

export interface ProductListReq extends PageReq {
  collections?: number[]
  tags?: string[]
  price_range?: { max: number | null, min: number | null }
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
  }>
}

export const ProductListApi = async (data: ProductListReq) => {
  return await api<PageRes<ProductListRes[]>>('/product/list', data)
}
