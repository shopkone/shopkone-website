import { api, PageReq, PageRes } from '@/api/api'

export interface TransferListReq extends PageReq {
}

export interface TransferListRes {
  id: number
  origin_id: number
  destination_id: number
  estimated_arrival: number
  status: number
  received: number
  rejected: number
  quantity: number
  transfer_number: string
}

export const TransferListApi = async (data: TransferListReq) => {
  return await api<PageRes<TransferListRes[]>>('/transfer/list', data)
}
