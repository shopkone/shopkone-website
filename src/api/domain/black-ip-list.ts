import { api } from '@/api/api'

export interface BlackIpListRes {
  ip: string
  type: number
}

export const DomainBlackIpListApi = async () => {
  return await api<BlackIpListRes[]>('/domain/black-ip/list')
}
