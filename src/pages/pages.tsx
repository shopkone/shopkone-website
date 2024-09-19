import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { AccountRoutes } from '@/pages/account/routes'
import NotFound from '@/pages/mange/error/not-found'
import { MangeRoutes } from '@/pages/mange/routes'

export default function Pages () {
  const router = createBrowserRouter(
    [
      ...MangeRoutes,
      ...AccountRoutes,
      { path: '/*', element: <NotFound /> }
    ]
  )

  return (
    <Suspense fallback={'LOADING'}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
