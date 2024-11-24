import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const CustomerList = lazy(async () => await import('./list'))
const CustomerChange = lazy(async () => await import('./change'))
const CustomerInfo = lazy(async () => await import('./info'))

export const CustomerRoutes: RouteObject[] = [
  { path: '/customers/customers', element: <CustomerList /> },
  { path: '/customers/customers/info/:id', element: <CustomerInfo /> },
  { path: '/customers/customers/change', element: <CustomerChange /> }
]
