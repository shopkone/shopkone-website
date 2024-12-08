import { api } from '@/api/api'
import { NavItemType } from '@/api/online/navInfo'

export interface NavUpdateReq {
  id: number
  title: string
  handle: string
  links: NavItemType[]
}

export const NavUpdateApi = async (req: NavUpdateReq) => {
  return await api('/online/nav/update', req)
}
