import { api } from '@/api/api'
import { ProductInfoRes } from '@/api/product/info'

export const ProductUpdateApi = async (data: ProductInfoRes) =>
  await api('/product/update', data)
