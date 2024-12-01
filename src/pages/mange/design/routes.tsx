import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const Design = lazy(async () => await import('./design'))

export const DesignRoutes: RouteObject = {
  path: '/design',
  element: <Design />
}
