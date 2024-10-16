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

export interface VariantsByIdsReq {
  ids: number[]
}

export interface VariantsByIdsRes {
  id: number
  image: string
  name: string
  product_title: string
}

const variantsByIds = async (data: VariantsByIdsReq) => {
  return await api<VariantsByIdsRes[]>('/product/variant/list-by-ids', data)
}

export const useVariantsByIds = () => {
  const [variants, setVariants] = useState<VariantsByIdsRes[]>([])
  const get = useRequest(variantsByIds, { manual: true })

  const run = async (params: VariantsByIdsReq) => {
    const { ids } = params
    const needGetIds = ids.filter(id => !variants.find(v => v.id === id))
    if (!needGetIds.length) return
    const ret = await get.runAsync({ ids: needGetIds })
    setVariants([...ret, ...variants])
  }

  return { run, data: variants, loading: get.loading }
}
