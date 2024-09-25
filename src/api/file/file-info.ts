import { api } from '@/api/api'

export interface FileInfoReq {
  id: number
}

export interface FileInfoRes {
  name: string
  path: string
  source: number
  size: number
  alt?: string
  type: number
  width?: number
  height?: number
  duration?: number
  suffix: string
  group_id?: number
  cover?: string
  created_at: number
}

export const FileInfoApi = async (params: FileInfoReq) => {
  return await api<FileInfoRes>('/file/info', params)
}
