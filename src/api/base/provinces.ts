import { api } from '@/api/api'

export interface ProvincesReq {
  country_code: string
}

export interface ProvincesRes {
  label: string
  value: string
}

export const ProvinceApi = async (params: ProvincesReq) => {
  return await api<ProvincesRes[]>('/base/province', params)
}
