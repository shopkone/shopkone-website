import { api } from '@/api/api'

export interface FileGroupRemoveReq {
  id: number
}
export const FileGroupRemoveApi = async (params: FileGroupRemoveReq) =>
  await api('/file/group/remove', params)
