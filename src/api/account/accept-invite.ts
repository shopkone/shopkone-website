import { api } from '@/api/api'

export interface AcceptInviteReq {
  token: string
  password: string
}

export interface AcceptInviteRes {
  token: string
  shop_uuid: string
}

export const AcceptInviteApi = async (data: AcceptInviteReq) => {
  return await api<AcceptInviteRes>('/account/accept-invite', data)
}
