import { api } from '@/api/api'
import { SeoType } from '@/components/seo/edit'

export interface BaseCondition {
  id: number
  action: string
  key: string
  value: string
}

export interface CreateProductCollectionReq {
  title: string
  description: string
  collection_type: number
  match_mode: number
  cover_id: number
  seo: SeoType
  conditions?: BaseCondition[]
  product_ids?: number[]
}

export interface CreateProductCollectionRes {
  id: number
}

export const CreateProductCollectionApi = async (data: CreateProductCollectionReq) => {
  return await api<CreateProductCollectionRes>('/product/collection/create', data)
}
