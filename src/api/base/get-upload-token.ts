import { api } from '@/api/api'

export const GetUploadTokenApi = async () => {
  return await api<{ token: string }>('/base/get-upload-token')
}
