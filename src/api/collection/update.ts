import { api } from '@/api/api'
import { CreateProductCollectionReq } from '@/api/collection/create'

export interface UpdateProductCollectionReq extends CreateProductCollectionReq {
  id: number
}

export const ProductCollectionUpdateApi = async (data: UpdateProductCollectionReq) => {
  return await api('/product/collection/update', data)
}
