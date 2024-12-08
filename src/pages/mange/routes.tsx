import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

import { CustomerRoutes } from '@/pages/mange/customer/routes'
import { DesignRoutes } from '@/pages/mange/design/routes'
import NotFound from '@/pages/mange/error/not-found'
import { OnlineRoutes } from '@/pages/mange/online/routes'
import { OrderRoutes } from '@/pages/mange/order/routes'
import { ProductRoutes } from '@/pages/mange/product/routes'
import { SettingsRoutes } from '@/pages/mange/settings/routes'

const Layout = lazy(async () => await import('@/pages/mange/layout/index'))

export const MangeRoutes: RouteObject[] = [
  {
    path: '',
    element: <Layout />,
    children: [
      ...ProductRoutes,
      ...SettingsRoutes,
      ...OrderRoutes,
      ...CustomerRoutes,
      ...OnlineRoutes,
      { path: '/*', element: <NotFound /> }
    ]
  },
  DesignRoutes
]
