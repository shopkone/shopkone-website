import { api } from '@/api/api'

export interface RegisterReq {
  email: string
  code: string
  password: string
}

export const RegisterApi = async (data: RegisterReq) => {
  return await api('/account/register', data)
}
