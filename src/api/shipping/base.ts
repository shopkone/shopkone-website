export enum ShippingType {
  GeneralExpressDelivery = 1, // 通用方案
  CustomerExpressDelivery = 2 // 自定义方案
}

/* var (
ShippingZoneFeeMatchRuleOrderPrice   ShippingZoneFeeMatchRule = 1 // 订单价格匹配
ShippingZoneFeeMatchRuleProductPrice ShippingZoneFeeMatchRule = 2 // 商品价格
ShippingZoneFeeMatchRuleProductCount ShippingZoneFeeMatchRule = 3 // 商品数量匹配
ShippingZoneFeeMatchRuleOrderWeight  ShippingZoneFeeMatchRule = 4 // 订单重量匹配
) */

export enum ShippingZoneFeeMatchRule {
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

export interface BaseShippingZoneFee {
  id: number
  name: string
  note: string
  match_rule: ShippingZoneFeeMatchRule
  match_max: number
  match_min: number
  match_weight_unit: string
  type: ShippingZoneFeeType
  fixed: number
  first: number
  first_uint: string
  first_fee: number
  next: number
  next_uint: string
  next_fee: number
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
