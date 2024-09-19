import { api } from '@/api/api'

export interface LoginReq {
  email: string
  password: string
}

export interface LoginRes {
  token: string
}

export const LoginApi = async (data: LoginReq) => {
  return await api<LoginRes>('/account/login', data)
}
