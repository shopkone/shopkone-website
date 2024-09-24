import { api, PageReq, PageRes } from '@/api/api'

export interface FileListReq extends PageReq {
}

export interface FileListRes {
  id: number
  file_name: string
  data_added: number
  suffix: string
  src: string
  size: number
  references: number
}

export const FileListApi = async (params: FileListReq) => {
  return await api<PageRes<FileListRes[]>>('/file/list', params)
}
