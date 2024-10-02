import { api } from '@/api/api'
import { ProductCreateReq } from '@/api/product/create'

export interface ProductInfoReq {
  id: number
}

export interface ProductInfoRes extends ProductCreateReq {
  id: number
}

export const ProductInfoApi = async (data: ProductInfoReq) => {
  return await api<ProductInfoRes>('/product/info', data)
}
