import { api } from '@/api/api'

export interface FileGroupUpdateReq {
  id: number
  name: string
}

export interface FileGroupUpdateRes {
  id: number
}

export const FileGroupUpdateApi = async (params: FileGroupUpdateReq) =>
  await api<FileGroupUpdateRes>('/file/group/update', params)
