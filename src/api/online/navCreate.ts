import { api } from '@/api/api'
import { NavItemType } from '@/api/online/navInfo'

export interface OnlineNavCreateReq {
  title: string
  handle: string
  links: NavItemType[]
}

export interface OnlineNavCreateRes {
  id: number
}

export const NavCreateApi = async (req: OnlineNavCreateReq) => {
  return await api<OnlineNavCreateRes>('/online/nav/create', req)
}
