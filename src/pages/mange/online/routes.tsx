import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const NavList = lazy(async () => await import('./nav-list/list'))
const NavChange = lazy(async () => await import('./nav-list/change'))
const Design = lazy(async () => await import('./design'))

export const OnlineRoutes: RouteObject[] = [
  { element: <NavList />, path: 'online/nav_list' },
  { element: <NavChange />, path: 'online/nav_list/add' },
  { element: <NavChange />, path: 'online/nav_list/change/:id' },
  { element: <Design />, path: 'online/design' }
]
