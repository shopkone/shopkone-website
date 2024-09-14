import { atom } from 'jotai'

import { Options } from '@/pages/product/product/product-change/variants/variant-changer'

export const loadingAtom = atom(false)

export const expandAtom = atom(false)

export interface VariantName {
  id: number
  label: string
  value: string
}

export interface Variant {
  id: number
  name: VariantName[]
  price: number
  weight_uint: 'kg' | 'lb' | 'oz' | 'g'
  compare_at_price?: number
  cost_per_item?: number
  children?: Variant[]
  isChild?: boolean
  isParent?: boolean
}

export const variantsAtom = atom<Variant[]>()

export const variantsOptions = atom<Options[]>([])
