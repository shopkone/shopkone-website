import { api } from '@/api/api'

export interface SetDefaultLocationReq {
  id: number
}

export const SetDefaultLocationApi = async (params: SetDefaultLocationReq) => {
  await api('/location/set-default', params)
}
