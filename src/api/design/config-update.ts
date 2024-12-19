import { api } from '@/api/api'

export interface DesignConfigUpdateReq {
  key: string
  value: any
}

export const DesignConfigUpdateApi = async (params: DesignConfigUpdateReq) => {
  return await api('/design/config/update', params)
}
