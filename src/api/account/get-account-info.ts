import { useRequest } from 'ahooks'

import { api } from '@/api/api'

export interface AuthInfoRes {
  email: string
  language: string
  is_master: boolean
}

export const AuthInfo = async () => {
  return await api<AuthInfoRes>('/user/info')
}

export const useGetLoginInfo = () => {
  const second = 1000
  return useRequest(AuthInfo, { staleTime: second * 10, cacheKey: 'LOGIN_INFO' })
}
