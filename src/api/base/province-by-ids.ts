import { http } from '@/http/http'

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
  return await http<ProvincesByIdsRes[]>('/base/province-by-ids', data)
}
