export enum ShippingType {
  GeneralExpressDelivery = 1, // 通用方案
  CustomerExpressDelivery = 2 // 自定义方案
}

export enum ShippingZoneFeeMatchRule {
  OrderPrice = 1, // 订单价格匹配
  ProductCount = 2, // 商品数量匹配
  OrderWeight = 3 // 订单重量匹配
}

export enum ShippingZoneFeeType {
  Fixed = 1, // 固定运费
  Weight = 2, // 按重量计费
  Price = 3 // 按售价比计费
}

export interface BaseShippingZoneFee {
  name: string
  note: string
  match_rule: ShippingZoneFeeMatchRule
  match_max: number
  match_min: number
  match_weight_unit: string
  type: ShippingZoneFeeType
  fixed: number
  ratio: number
  first_weight: number
  first_weight_uint: string
  first_weight_fee: number
  next_weight: number
  next_weight_uint: string
  next_weight_fee: number
}

export interface BaseShippingZone {
  name: string
  codes: string[]
  fees: BaseShippingZoneFee[]
}

export interface BaseShipping {
  name: string
  type: ShippingType
  product_ids: number[]
  location_ids: number[]
  zones: BaseShippingZone[]
}
