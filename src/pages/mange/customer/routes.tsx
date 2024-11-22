import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const CustomerList = lazy(async () => await import('./list'))
const CustomerChange = lazy(async () => await import('./change'))

export const CustomerRoutes: RouteObject[] = [
  { path: '/customers/customers', element: <CustomerList /> },
  { path: '/customers/customers/change/:id', element: <CustomerChange /> },
  { path: '/customers/customers/change', element: <CustomerChange /> }
]
