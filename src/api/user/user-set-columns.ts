import { api } from '@/api/api'

export interface ColumnItem {
  name: string
  nick: string
  lock?: boolean
  hidden?: boolean
  required?: boolean
}

export type UserColumnType = 'product' | 'variant'

export interface SetColumnsReq {
  columns: ColumnItem[]
  type: UserColumnType
}

export const SetColumnsApi = async (params: SetColumnsReq) => {
  await api('/user/set-columns', params)
}
