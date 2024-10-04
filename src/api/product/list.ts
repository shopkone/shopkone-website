import { api, PageReq, PageRes } from '@/api/api'

export interface ProductListReq extends PageReq {
}

export interface ProductListRes {
  id: number
}

export const ProductListApi = async (data: ProductListReq) => {
  return await api<PageRes<ProductListRes[]>>('/product/list', data)
}
