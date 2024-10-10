import { api, PageReq, PageRes } from '@/api/api'

export interface ProductListReq extends PageReq {
}

export interface ProductListRes {
  id: number
  min_price: number
  max_price: number
  spu: string
  vendor: string
  quantity: number
  created_at: number
  status: string
  image: string
  title: string
}

export const ProductListApi = async (data: ProductListReq) => {
  return await api<PageRes<ProductListRes[]>>('/product/list', data)
}
