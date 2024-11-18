import { api } from '@/api/api'

export enum BlackIpType {
  Black = 1,
  White = 2
}

export interface DomainBlackIpUpdateReq {
  ips: string[]
  type: BlackIpType
}

export const DomainBlackIpUpdateApi = async (params: DomainBlackIpUpdateReq) => {
  return await api('/domain/black-ip/update', params)
}
