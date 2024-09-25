import { api } from '@/api/api'

export interface FileDeleteReq {
  ids: number[]
}

export const FilesDeleteApi = async (params: FileDeleteReq) => {
  return await api('/files/delete', params)
}
