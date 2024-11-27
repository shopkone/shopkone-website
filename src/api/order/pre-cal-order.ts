import { api } from '@/api/api'
import { AddressType } from '@/api/common/address'

export interface OrderPreBaseShippingFee {
  free: boolean
  name: string
  price: number
  shipping_fee_id: number
}

export interface OrderPreBaseDiscount {
  id: number
  price: number
  type: number
}

export interface OrderPreBaseVariantItem {
  variant_id: number
  quantity: number
  discount: OrderPreBaseDiscount
}

export interface BasePreShippingFeePlan {
  label: string
  value: number
}

export interface OrderCalPreReq {
  variant_items: OrderPreBaseVariantItem[]
  market_id: number
  discount?: OrderPreBaseDiscount
  address: AddressType
  customer_id?: number
  shipping_fee?: OrderPreBaseShippingFee
}

export interface OrderCalPreRes {
  cost_price: number
  tax_price: number
  shipping_price: number
  discount_price: number
  sum_price: number
  total: number
  shipping_fee_plans: BasePreShippingFeePlan[]
}

export const OrderPreCalApi = async (data: OrderCalPreReq) => {
  return await api<OrderCalPreRes>('/order/calculate-pre', data)
}
