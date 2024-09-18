import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const Auth = lazy(async () => await import('@/pages/account/auth/index'))
const AuthLogin = lazy(async () => await import('@/pages/account/auth/login'))
const AuthLogout = lazy(async () => await import('@/pages/account/auth/logout'))
const AuthResetPwd = lazy(async () => await import('@/pages/account/auth/reset-pwd'))

export const AccountRoutes: RouteObject[] = [
  {
    element: <Auth />,
    path: 'accounts',
    children: [
      { element: <AuthLogin />, path: 'login' }
    ]
  }
]
