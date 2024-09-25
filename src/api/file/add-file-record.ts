import { api } from '@/api/api'

export enum FileType {
  Image = 1,
  Video = 2,
  Audio = 3,
  Other = 4
}

export enum FileSource {
  Local = 1,
  Remote = 2,
  Other = 3
}

export interface AddFileReq {
  name: string
  path: string
  source: FileSource
  size: number
  alt?: string
  type: FileType
  width?: number
  height?: number
  duration?: number
  suffix: string
  group_id: number
}

export interface AddFileRes {
  id: number
}

export const AddFileApi = async (params: AddFileReq) => {
  return await api<AddFileRes>('/file/add', params)
}
