/*
// CarrierListReq 获取物流商列表
type CarrierListReq struct {
  g.Meta `path:"/base/carrier-list" method:"post" summary:"获取物流商列表" tags:"Base"`
}
type CarrierListRes struct {
  Id   string `json:"id"`
  Name string `json:"name"`
  Url  string `json:"url"`
}
*/

import { useRequest } from 'ahooks'

import { api } from '@/api/api'

export interface CarriersRes {
  id: string
  name: string
  url: string
}

const GetCarrierList = async () => {
  return await api<CarriersRes[]>('/base/carrier-list')
}

export const useCarriers = () => {
  return useRequest(GetCarrierList, { staleTime: -1, cacheKey: 'CARRIERS_LIST' })
}
