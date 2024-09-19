import { api } from '@/api/api'

export interface SendCodeReq {
  email: string
  type: 'register' | 'reset-pwd'
}

export interface SendCodeRes {
  token: string
}

export const SendCodeApi = async (data: SendCodeReq) => {
  return await api<SendCodeRes>('/account/send-code', data)
}
