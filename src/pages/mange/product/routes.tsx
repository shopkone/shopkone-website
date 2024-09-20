import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const ProductChange = lazy(async () => await import('./product/product-change'))
const Products = lazy(async () => await import('./product/products'))
const Collections = lazy(async () => await import('./collections/collections'))
const CollectionsChange = lazy(async () => await import('./collections/change'))
const Inventory = lazy(async () => await import('./inventory/inventory'))
const Purchase = lazy(async () => await import('./purchase/purchase'))
const PurchaseChange = lazy(async () => await import('./purchase/change'))
const GiftCard = lazy(async () => await import('./gift-card/gift-card'))
const GiftCardChange = lazy(async () => await import('./gift-card/change'))
const GiftCardProductChange = lazy(async () => await import('./gift-card/product-change'))

export const ProductRoutes: RouteObject[] = [
  { element: <Products />, path: '/products/products' },
  { element: <ProductChange />, path: '/products/products/change' },
  { element: <Collections />, path: '/products/collections' },
  { element: <CollectionsChange />, path: '/products/collections/change' },
  { element: <Inventory />, path: '/products/inventory' },
  { element: <Purchase />, path: '/products/purchase_orders' },
  { element: <PurchaseChange />, path: '/products/purchase_orders/change' },
  { element: <GiftCard />, path: '/products/gift_cards' },
  { element: <GiftCardChange />, path: '/products/gift_cards/change' },
  { element: <GiftCardProductChange />, path: '/products/gift_cards/product_change' }
]
