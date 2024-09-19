import { http } from '@/http/http'

export const GetUploadTokenApi = async () => {
  return await http<{ token: string }>('/base/get-upload-token')
}
