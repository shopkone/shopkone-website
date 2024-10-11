import { api, PageReq, PageRes } from '@/api/api'

export interface ProductListReq extends PageReq {

}

export interface ProductListRes {
  id: number
  spu: string
  vendor: string
  created_at: number
  status: number
  title: string
  image: string
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
