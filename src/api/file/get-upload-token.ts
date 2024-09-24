import { api } from '@/api/api'

export interface GetUploadTokenRes {
  token: string
}

export const GetUploadTokenApi = async () => {
  return await api<GetUploadTokenRes>('/file/upload/token')
}
