import { api } from '@/api/api'
import { TransferCreateReq } from '@/api/transfers/create'

export interface TransferUpdateReq extends TransferCreateReq {
  id: number
}

export const TransferUpdateApi = async (data: TransferUpdateReq) => {
  return await api('/transfer/update', data)
}
