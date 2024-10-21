import { api } from '@/api/api'

export interface CollectionOptionsRes {
  value: number
  label: string
  disabled: boolean
}

export const CollectionOptionsApi = async () => {
  return await api<CollectionOptionsRes[]>('/product/collection/options')
}
