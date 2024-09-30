export interface VariantName {
  id: number
  label: string
  value: string
  imageId?: number
}

export interface Variant {
  id: number
  name: VariantName[]
  price: number
  weight_uint: 'kg' | 'lb' | 'oz' | 'g'
  weight?: number
  compare_at_price?: number
  cost_per_item?: number
  barcode?: string
  inventories: Array<{ id: number, quantity: number, location_id: number }>
  sku?: string
  children?: Variant[]
  parentId?: number
  isParent: boolean
}

export interface Option {
  name: string
  values: Array<{ value: string, id: number, imageId?: number }>
  id: number
  isDone?: boolean
}
