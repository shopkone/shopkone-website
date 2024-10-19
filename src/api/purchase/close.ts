import { api } from '@/api/api'

export interface PurchaseCloseReq {
  id: number
  close: boolean
}

export const PurchaseCloseApi = async (params: PurchaseCloseReq) => {
  return await api('/purchase/close', params)
}
