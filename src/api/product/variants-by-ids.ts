/*
type VariantListByIdsReq struct {
  g.Meta `path:"/product/variant/list-by-ids" method:"post" summary:"根据变体ID列表获取变体列表" tags:"Product"`
  Ids    []uint `json:"ids" v:"required" dc:"变体ID列表"`
}
type VariantListByIdsRes struct {
  Id           uint   `json:"id"`
  Image        string `json:"image"`
  Name         string `json:"name"`
  ProductTitle string `json:"product_title"`
}
*/

import { useState } from 'react'
import { useRequest } from 'ahooks'

import { api } from '@/api/api'
import { InventoryPolicy } from '@/constant/product'

export interface VariantsByIdsReq {
  ids: number[]
  has_deleted?: boolean
  has_inventory?: boolean
  location_id?: number
}

export interface VariantsByIdsRes {
  id: number
  image: string
  name: string
  product_title: string
  rejected?: number
  received?: number
  is_deleted: boolean
  price: number
  inventory: number
  inventory_tracking: boolean
  inventory_policy: InventoryPolicy
}

const variantsByIds = async (data: VariantsByIdsReq) => {
  return await api<VariantsByIdsRes[]>('/product/variant/list-by-ids', data)
}

export const useVariantsByIds = (query?: Omit<VariantsByIdsReq, 'ids'>) => {
  const [variants, setVariants] = useState<VariantsByIdsRes[]>([])
  const get = useRequest(variantsByIds, { manual: true })

  const run = async (params: VariantsByIdsReq) => {
    const { ids } = params
    const needGetIds = ids.filter(id => !variants.find(v => v.id === id))
    if (!needGetIds.length) return variants
    const ret = await get.runAsync({ ...query, ids: needGetIds })
    setVariants([...ret, ...variants])
    return [...ret, ...variants]
  }

  return { run, data: variants, loading: get.loading }
}
