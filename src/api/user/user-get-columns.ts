import { api } from '@/api/api'
import { ColumnItem, UserColumnType } from '@/api/user/user-set-columns'

export interface GetColumnsReq {
  type: UserColumnType
}
export interface GetColumnsRes {
  columns: ColumnItem[]
}

export const GetColumnsApi = async (params: GetColumnsReq) => {
  return await api<GetColumnsRes>('/user/get-columns', params)
}
