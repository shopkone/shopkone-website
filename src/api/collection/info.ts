import { api } from '@/api/api'
import { CreateProductCollectionReq } from '@/api/collection/create'

export interface ProductCollectionInfoReq {
  id: number
}

export interface ProductCollectionInfoRes extends CreateProductCollectionReq {
  id: number
}

export const ProductCollectionInfoApi = async (data: ProductCollectionInfoReq) => {
  return await api<ProductCollectionInfoRes>('/product/collection/info', data)
}
