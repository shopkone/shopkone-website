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
  weight_unit: 'kg' | 'lb' | 'oz' | 'g'
  weight: number | null
  compare_at_price: number | null
  cost_per_item: number | null
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
