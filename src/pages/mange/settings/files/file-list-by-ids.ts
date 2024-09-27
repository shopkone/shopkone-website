import { api } from '@/api/api'

export interface FileListByIdsReq {
  ids: number[]
}

export interface FileListByIdsRes {
  id: number
  path: string
}

export const fileListByIds = async (params: FileListByIdsReq) => {
  return await api<FileListByIdsRes[]>('/file/list/by_ids', params)
}
