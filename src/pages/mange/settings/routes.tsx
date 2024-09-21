import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const General = lazy(async () => await import('./general'))

export const SettingsRoutes: RouteObject[] = [
  { element: <General />, path: '/settings/general' }
]
