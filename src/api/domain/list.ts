import { api } from '@/api/api'

export enum DomainStatus {
  ConnectPre = 1, // 预连接
  ConnectSuccess, // 连接成功
  ConnectFailed, // 连接失败
  Disconnect // 连接断开
}

export interface DomainListReq {
  status?: DomainStatus[]
}

export interface DomainListRes {
  id: number
  status: DomainStatus
  is_main: boolean
  is_shopkimi: boolean
  domain: string
}

export const DomainListApi = async (params: DomainListReq) => {
  return await api<DomainListRes[]>('/domain/list', params)
}
