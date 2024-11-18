import { api } from '@/api/api'

export interface DomainBlockCountryUpdateReq {
  codes: string[]
}

export const BlockCountryUpdateApi = async (params: DomainBlockCountryUpdateReq) => {
  return await api('/domain/block-country/update', params)
}
