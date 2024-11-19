export enum DiscountType {
  Ratio = 1,
  Fixed = 2
}

export interface OrderVariant {
  variant_id: number
  variant_name: string
  product_id: number
  product_title: string
  image: string
  quantity: number
  price: number
  discount?: {
    type: DiscountType
    value: number
    note?: string
  }
  inventory?: number
}

export interface OrderCountry {
  country_code: string
  currency_code: string
}
