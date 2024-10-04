import { create } from 'zustand/react'

import { ProductInfoRes } from '@/api/product/info'

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
  hidden?: boolean
}

export interface Option {
  name: string
  values: Array<{ value: string, id: number, imageId?: number }>
  id: number
  isDone?: boolean
}

export interface ProductChangeState {
  info?: ProductInfoRes
}

export interface ProductChangeAction {
  setInfo: (info?: ProductInfoRes) => void
}

export const useProductChange = create<ProductChangeState & ProductChangeAction>((set, get, store) => ({
  setInfo: (info) => { set({ info }) }
}))
