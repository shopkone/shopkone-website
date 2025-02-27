import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const ProductChange = lazy(async () => await import('./product/product-change'))
const Products = lazy(async () => await import('./product/products'))
const Collections = lazy(async () => await import('./collections/collections'))
const CollectionsChange = lazy(async () => await import('./collections/change'))
const Inventory = lazy(async () => await import('./inventory/inventory'))
const Purchase = lazy(async () => await import('./purchase/purchase'))
const PurchaseChange = lazy(async () => await import('./purchase/change'))
const PurchaseReceive = lazy(async () => await import('./purchase/receive'))
const GiftCard = lazy(async () => await import('./gift-card/gift-card'))
const GiftCardChange = lazy(async () => await import('./gift-card/change'))
const GiftCardProductChange = lazy(async () => await import('./gift-card/product-change'))
const TransferList = lazy(async () => await import('./transfers/list'))
const TransferCreate = lazy(async () => await import('./transfers/create'))
const TransferReceived = lazy(async () => await import('./transfers/received'))

export const ProductRoutes: RouteObject[] = [
  { element: <Products />, path: '/products/products' },
  { element: <ProductChange />, path: '/products/products/change' },
  { element: <ProductChange />, path: '/products/products/change/:id' },
  { element: <Collections />, path: '/products/collections' },
  { element: <CollectionsChange />, path: '/products/collections/change' },
  { element: <CollectionsChange />, path: '/products/collections/change/:id' },
  { element: <Inventory />, path: '/products/inventory' },
  { element: <Inventory />, path: '/products/inventory/:id' },
  { element: <Purchase />, path: '/products/purchase_orders' },
  { element: <PurchaseChange />, path: '/products/purchase_orders/change' },
  { element: <PurchaseChange />, path: '/products/purchase_orders/change/:id' },
  { element: <PurchaseChange />, path: '/products/purchase_orders/info/:id' },
  { element: <PurchaseReceive />, path: '/products/purchase_orders/receive/:id' },
  { element: <GiftCard />, path: '/products/gift_cards' },
  { element: <GiftCardChange />, path: '/products/gift_cards/change' },
  { element: <GiftCardProductChange />, path: '/products/gift_cards/product_change' },
  { element: <TransferList />, path: '/products/transfers' },
  { element: <TransferCreate />, path: '/products/transfers/create' },
  { element: <TransferCreate />, path: '/products/transfers/info/:id' },
  { element: <TransferReceived />, path: '/products/transfers/received/:id' }
]
