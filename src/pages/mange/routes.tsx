import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

import NotFound from '@/pages/mange/error/not-found'
import { ProductRoutes } from '@/pages/mange/product/routes'
import { SettingsRoutes } from '@/pages/mange/settings/routes'

const Layout = lazy(async () => await import('@/pages/mange/layout/index'))

export const MangeRoutes: RouteObject[] = [{
  path: '',
  element: <Layout />,
  children: [
    ...ProductRoutes,
    ...SettingsRoutes,
    { path: '/*', element: <NotFound /> }
  ]
}]
