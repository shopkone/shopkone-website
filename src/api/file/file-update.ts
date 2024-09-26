import { api } from '@/api/api'

export interface FileUpdateInfoReq {
  id: number
  name?: string
  alt?: string
  cover?: string
  src?: string
}

export const FileUpdateApi = async (params: FileUpdateInfoReq) => {
  return await api('/file/update/info', params)
}
