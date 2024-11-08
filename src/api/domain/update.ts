import { api } from '@/api/api'

export interface MarketUpDomainReq {
  id: number
  domain_type: number
  domain_suffix: string
  sub_domain_id: number
}

export interface MarketUpDomainRes {
}

export const MarketUpDomainApi = async (params: MarketUpDomainReq) => {
  return await api('/market/up-domain', params)
}
