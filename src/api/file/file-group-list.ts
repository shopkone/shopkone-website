import { api } from '@/api/api'

export interface FileGroupListRes {
  id: number
  name: string
  count: number
}

export const FileGroupListApi = async () =>
  await api<FileGroupListRes[]>('/file/group/list')
