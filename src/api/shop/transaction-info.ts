import { api } from '@/api/api'

export enum TransactionTargetType {
  All = 1, // 所有客户
  Login = 2 // 仅登录
}

export enum TransactionReduceTime {
  Pay = 1, // 支付时扣减库存
  Order = 2 // 下单时扣减库存
}

export interface ShopTransactionInfoRes {
  target_type: TransactionTargetType // 目标客户
  reduce_time: TransactionReduceTime // 库存扣减时机
  is_force_check_product: boolean // 是否强制检测商品库存
  is_auto_finish: boolean // 是否开启自动收货
  auto_finish_day: number // 自动收货时间
  order_auto_cancel: number // 订单自动取消时间
  order_auto_cancel_customer_hour: number
}

export const TransactionInfoApi = async () => {
  return await api<ShopTransactionInfoRes>('/shop/transaction/info')
}
