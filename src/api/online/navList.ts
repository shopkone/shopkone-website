import { api } from '@/api/api'

export interface NavListRes {
  id: number
  title: string
  handle: string
  first_names: string[]
}

export const NavListApi = async () => {
  return await api<NavListRes[]>('online/nav/list')
}
