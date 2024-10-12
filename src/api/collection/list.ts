import { api, PageReq, PageRes } from '@/api/api'

export interface ProductCollectionListReq extends PageReq {
}

export interface ProductCollectionListRes {
  id: number
  title: string
  cover: string
  collection_type: number
  product_quantity: number
}

export const ProductCollectionListApi = async (data: ProductCollectionListReq) => {
  return await api<PageRes<ProductCollectionListRes[]>>('/product/collection/list', data)
}
