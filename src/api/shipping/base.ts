export enum ShippingType {
  GeneralExpressDelivery = 1, // 通用方案
  CustomerExpressDelivery = 2 // 自定义方案
}

export enum ShippingZoneFeeRule {
  OrderPrice = 1, // 订单价格匹配
  ProductPrice = 2, // 商品价格
  ProductCount = 3, // 商品数量匹配
  OrderWeight = 4 // 订单重量匹配
}

export enum ShippingZoneFeeType {
  Fixed = 1, // 固定运费
  Weight = 2, // 按重量计费
  Count = 3 // 按商品数量
}

export interface BaseShippingZoneFeeCondition {
  id: number
  fixed: number
  first: number
  first_fee: number
  next: number
  next_fee: number
  max: number
  min: number
}

export interface BaseShippingZoneFee {
  id: number
  name: string
  note: string
  weight_unit: string
  type: ShippingZoneFeeType
  currency_code: string
  conditions?: BaseShippingZoneFeeCondition[]
  rule?: ShippingZoneFeeRule
}

export interface BaseShippingZone {
  name: string
  codes: string[]
  fees: BaseShippingZoneFee[]
  id: number
}

export interface BaseShipping {
  id: number
  name: string
  type: ShippingType
  product_ids: number[]
  location_ids: number[]
  zones: BaseShippingZone[]
}
