import { api } from '@/api/api'

export interface UpdateTransactionReq {
  target_type: number
  reduce_time: number
  is_force_check_product: boolean
  is_auto_finish: boolean
  auto_finish_day: number
  order_auto_cancel: number
  order_auto_cancel_customer_hour: number
}

export const UpdateTransactionApi = async (data: UpdateTransactionReq) => {
  return await api('/shop/update/transaction', data)
}
