import { api } from '@/api/api'

export interface NavInfoReq {
  id: number
}

export interface NavItemType {
  id: string
  title: string
  url: string
  links: NavItemType[]
  collapsed?: boolean
}

export interface NavInfoRes {
  id: number
  title: string
  handle: string
  links: NavItemType[]
}

export const NavInfoApi = async (req: NavInfoReq) => {
  return await api<NavInfoRes>('online/nav/info', req)
}
