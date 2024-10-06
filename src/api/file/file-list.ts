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
  group_id: number
  uuid?: string
  errMsg?: string
}

export const FileListApi = async (params: FileListReq, extra?: FileType[]) => {
  let allFileType: FileType[] = [FileType.Audio, FileType.Image, FileType.Video, FileType.Other]
  allFileType = allFileType.filter(item => !extra?.includes(item))
  const query: FileListReq = {
    ...params,
    file_type: params?.file_type?.length ? params.file_type : allFileType
  }
  return await api<PageRes<FileListRes[]>>('/file/list', query)
}
