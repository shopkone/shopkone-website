import { api } from '@/api/api'

export interface CheckInviteReq {
  token: string
}

export interface CheckInviteRes {
  shop_name: string
  user_id: number
  staff_id: number
  shop_id: number
  email: string
}

export const CheckInviteApi = async (data: CheckInviteReq) => {
  return await api<CheckInviteRes>('/account/check-invite', data)
}
