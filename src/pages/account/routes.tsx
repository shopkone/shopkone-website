import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

import NotFound from '@/pages/mange/error/not-found'

const Auth = lazy(async () => await import('@/pages/account/auth'))
const AuthLogin = lazy(async () => await import('@/pages/account/auth/login'))
const AuthLoginType = lazy(async () => await import('@/pages/account/auth/login/login-type'))
const AuthLoginEmail = lazy(async () => await import('@/pages/account/auth/login/email-login'))
const AuthSignup = lazy(async () => await import('@/pages/account/auth/signup'))
const AuthSignupType = lazy(async () => await import('@/pages/account/auth/signup/signup-type'))
const AuthSignupEmail = lazy(async () => await import('@/pages/account/auth/signup/email-signup'))
const AuthResetPwd = lazy(async () => await import('@/pages/account/auth/reset-pwd'))

export const AccountRoutes: RouteObject[] = [
  {
    element: <Auth />,
    path: 'auth',
    children: [
      {
        element: <AuthLogin />,
        path: 'login',
        children: [
          { element: <AuthLoginType />, path: '' },
          { element: <AuthLoginEmail />, path: 'email' }
        ]
      },
      {
        element: <AuthSignup />,
        path: 'signup',
        children: [
          { element: <AuthSignupType />, path: '' },
          { element: <AuthSignupEmail />, path: 'email' }
        ]
      },
      { element: <AuthResetPwd />, path: 'reset-pwd' },
      { element: <NotFound veritcal />, path: '' }
    ]
  },
  { path: '/*', element: <NotFound /> }
]
