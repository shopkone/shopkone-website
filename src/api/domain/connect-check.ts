import { api } from '@/api/api'

export interface DomainConnectCheckReq {
  domain: string
}

export interface DomainConnectCheckRes {
  is_connect: boolean
}

export const DomainConnectCheckApi = async (params: DomainConnectCheckReq) => {
  return await api<DomainConnectCheckRes>('/domain/connect/check', params)
}
