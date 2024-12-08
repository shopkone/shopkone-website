import { api } from '@/api/api'

export interface NavInfoReq {
  id: number
}

export interface NavItemType {
  id: number
  title: string
  url: string
  parent_id: number
  levels: number
  links?: NavItemType[]
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
