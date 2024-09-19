import { api } from '@/api/api'

export const LogoutApi = async () => {
  return await api('/account/logout')
}
