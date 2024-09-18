import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const ProductChange = lazy(async () => await import('./product-change'))
const Products = lazy(async () => await import('./products'))

export const ProductRoutes: RouteObject[] = [
  { element: <Products />, path: '/products' },
  { element: <ProductChange />, path: '/products/change' }
]
