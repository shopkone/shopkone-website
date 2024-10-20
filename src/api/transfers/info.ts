import { api } from '@/api/api'
import { TransferCreateReq } from '@/api/transfers/create'
import { TransferStatus } from '@/constant/transfers'

export interface TransferInfoReq {
  id: number
}

export interface TransferInfoRes extends TransferCreateReq {
  id: number
  status: TransferStatus
  transfer_number: string
}

export const TransferInfoApi = async (data: TransferInfoReq) => {
  return await api<TransferInfoRes>('/transfer/info', data)
}
