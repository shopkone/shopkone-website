import { api } from '@/api/api'

export interface ResetPwdReq {
  email: string
  code: string
  password: string
}

export const ResetPwdApi = async (data: ResetPwdReq) => {
  return await api('/account/reset-pwd', data)
}
