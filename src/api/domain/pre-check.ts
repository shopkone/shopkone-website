import { api } from '@/api/api'

export interface DomainPreCheckReq {
  domain: string
}
export interface DomainPreCheckRes {
  type: string
  host: string
  value: string
}

export const DomainPreCheckApi = async (params: DomainPreCheckReq) => {
  return await api<DomainPreCheckRes[]>('/domain/pre', params)
}
