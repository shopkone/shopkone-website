import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

import NotFound from '@/pages/mange/error/not-found'

const Auth = lazy(async () => await import('@/pages/account/auth'))
const AuthLogin = lazy(async () => await import('@/pages/account/auth/login'))
const AuthSignup = lazy(async () => await import('@/pages/account/auth/signup'))
const AuthResetPwd = lazy(async () => await import('@/pages/account/auth/reset-pwd'))

export const AccountRoutes: RouteObject[] = [
  {
    element: <Auth />,
    path: 'auth',
    children: [
      { element: <AuthLogin />, path: 'login' },
      { element: <AuthSignup />, path: 'signup' },
      { element: <AuthResetPwd />, path: 'reset-pwd' },
      { element: <NotFound veritcal />, path: '' }
    ]
  },
  { path: '/*', element: <NotFound /> }
]
