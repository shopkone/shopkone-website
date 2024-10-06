import { api } from '@/api/api'
import { FileType } from '@/api/file/add-file-record'

export interface FileListByIdsReq {
  ids: number[]
}

export interface FileListByIdsRes {
  id: number
  path: string
  type: FileType
  cover: string
}

export const fileListByIds = async (params: FileListByIdsReq) => {
  return await api<FileListByIdsRes[]>('/file/list/by_ids', params)
}
