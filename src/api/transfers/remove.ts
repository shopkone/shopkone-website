import { api } from '@/api/api'

export interface TransferRemoveReq {
  id: number
}

export const TransferRemoveApi = async (data: TransferRemoveReq) => {
  return await api('transfer/remove', data)
}
