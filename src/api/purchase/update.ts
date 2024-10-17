import { api } from '@/api/api'
import { PurchaseCreateReq } from '@/api/purchase/create'

export interface PurchaseUpdateReq extends PurchaseCreateReq {
  id: number
}

export const PurchaseUpdateApi = async (params: PurchaseUpdateReq) => {
  return await api('/purchase/update', params)
}
