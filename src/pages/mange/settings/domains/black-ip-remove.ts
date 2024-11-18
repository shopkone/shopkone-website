import { api } from '@/api/api'
import { BlackIpType } from '@/api/domain/black-ip-update'

export interface DomainBlackIpRemoveReq {
  ips: string[]
  type: BlackIpType
}

export const DomainBlackIpRemoveApi = async (params: DomainBlackIpRemoveReq) => {
  return await api('/domain/black-ip/remove', params)
}
