import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const Auth = lazy(async () => await import('@/pages/account'))
const AuthLogin = lazy(async () => await import('@/pages/account/login'))
const AuthSignup = lazy(async () => await import('@/pages/account/signup'))
const AuthResetPwd = lazy(async () => await import('@/pages/account/reset-pwd'))

export const AccountRoutes: RouteObject[] = [
  {
    element: <Auth />,
    path: 'accounts',
    children: [
      { element: <AuthLogin />, path: 'login' },
      { element: <AuthSignup />, path: 'signup' },
      { element: <AuthResetPwd />, path: 'reset-pwd' }
    ]
  }
]
