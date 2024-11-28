import { api } from '@/api/api'
import { AddressType } from '@/api/common/address'

export interface OrderPreBaseShippingFee {
  free?: boolean
  customer?: boolean
  name?: string
  price?: number
  shipping_fee_id?: number
}

export enum OrderDiscountType {
  Percentage = 1,
  Fixed = 2
}

export interface OrderPreBaseDiscount {
  id: number
  price: number
  type: OrderDiscountType
  note: string
}

export interface OrderPreBaseVariantItem {
  variant_id: number
  quantity: number
  discount: OrderPreBaseDiscount
}

export interface BasePreShippingFeePlan {
  id: number
  name: string
  price: number
}

export interface OrderPreBaseTax {
  name: string
  rate: number
  price: number
}

export interface OrderCalPreReq {
  variant_items: OrderPreBaseVariantItem[]
  discount?: OrderPreBaseDiscount
  address: AddressType
  customer_id?: number
  shipping_fee?: OrderPreBaseShippingFee
}

export interface OrderCalPreRes {
  cost_price: number
  tax_price: number
  shipping_fee: OrderPreBaseShippingFee
  discount_price: number
  sum_price: number
  total: number
  shipping_fee_plans: BasePreShippingFeePlan[]
  taxes: OrderPreBaseTax[]
}

export const OrderPreCalApi = async (data: OrderCalPreReq) => {
  return await api<OrderCalPreRes>('/order/calculate-pre', data)
}
