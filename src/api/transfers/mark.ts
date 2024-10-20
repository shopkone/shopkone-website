import { api } from '@/api/api'

export interface TransferMarkReq {
  id: number
}

export const TransferMarkApi = async (data: TransferMarkReq) => {
  return await api('/transfer/mark', data)
}
