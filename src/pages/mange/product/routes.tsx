import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const ProductChange = lazy(async () => await import('./product/product-change'))
const Products = lazy(async () => await import('./product/products'))
const Collections = lazy(async () => await import('./collections/collections'))
const Inventory = lazy(async () => await import('./inventory/inventory'))
const Purchase = lazy(async () => await import('./purchase/purchase'))
const Transfers = lazy(async () => await import('./transfers/transfers'))
const GiftCard = lazy(async () => await import('./gift-card/gift-card'))

export const ProductRoutes: RouteObject[] = [
  { element: <Products />, path: '/products/list' },
  { element: <ProductChange />, path: '/products/list/change' },
  { element: <Collections />, path: '/products/collections' },
  { element: <Inventory />, path: '/products/inventory' },
  { element: <Purchase />, path: '/products/purchase_order' },
  { element: <Transfers />, path: '/products/transfers' },
  { element: <GiftCard />, path: '/products/gift_cards' }
]
