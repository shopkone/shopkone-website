import { api } from '@/api/api'

export interface ProvincesReqItem {
  country_code: string
  province_code: string
}

export interface ProvincesByIdsReq {
  list: ProvincesReqItem[]
}

export interface ProvincesByIdsRes {
  label: string
  value: string
}

export const ProvincesByIdsApi = async (data: ProvincesByIdsReq) => {
  return await api<ProvincesByIdsRes[]>('/base/province-by-ids', data)
}
