import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import SLoading from '@/components/s-loading'
import { AccountRoutes } from '@/pages/account/routes'

export default function Account () {
  const accountRoutes = createBrowserRouter(
    AccountRoutes,
    { basename: '/accounts/' }
  )

  return (
    <Suspense fallback={<SLoading />}>
      <RouterProvider router={accountRoutes} />
    </Suspense>
  )
}
