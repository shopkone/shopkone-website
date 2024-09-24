import { api } from '@/api/api'

export interface FileGroupAddReq {
  name: string
}

export interface FileGroupAddRes {
  id: number
}

export const FileGroupAddApi = async (params: FileGroupAddReq) =>
  await api<FileGroupAddRes>('/file/group/add', params)
