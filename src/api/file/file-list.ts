import { api, PageReq, PageRes } from '@/api/api'
import { FileType } from '@/api/file/add-file-record'

export interface FileListReq extends PageReq {
  keyword?: string
  file_size?: { min?: number, max?: number }
  file_type?: number[]
  used?: number
  group_id: number
}

export interface FileListRes {
  id: number
  file_name: string
  data_added: number
  suffix: string
  src: string
  size: number
  references: number
  cover?: string
  type: FileType
}

export const FileListApi = async (params: FileListReq) => {
  return await api<PageRes<FileListRes[]>>('/file/list', params)
}
