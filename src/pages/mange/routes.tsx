import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

import { ProductRoutes } from '@/pages/mange/product/routes'

const Layout = lazy(async () => await import('@/pages/mange/layout/index'))

export const MangeRoutes: RouteObject[] = [{
  path: '/',
  element: <Layout />,
  children: [
    ...ProductRoutes
  ]
}]
