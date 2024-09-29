import { api } from '@/api/api'

export interface RemoveLocationReq {
  id: number
}

export const RemoveLocationApi = async (params: RemoveLocationReq) =>
  await api('/location/delete', params)
