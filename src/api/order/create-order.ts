export enum DiscountType {
  ratio = 1,
  fixed = 2
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
  }
}
