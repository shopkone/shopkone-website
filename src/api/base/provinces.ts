import { http } from '@/http/http'

export interface ProvincesReq {
  country_code: string
}

export interface ProvincesRes {
  label: string
  value: string
}

export const ProvinceApi = async (params: ProvincesReq) => {
  return await http<ProvincesRes[]>('/base/province', params)
}
