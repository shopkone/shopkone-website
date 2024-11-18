import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const OrderDraftChange = lazy(async () => await import('./draft/change'))
const OrderDraftList = lazy(async () => await import('./draft/list'))

export const OrderRoutes: RouteObject[] = [
  {
    element: <OrderDraftChange />,
    path: '/orders/drafts/change'
  },
  {
    element: <OrderDraftList />,
    path: '/orders/drafts'
  }
]
