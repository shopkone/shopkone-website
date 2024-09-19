import { Suspense, useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import SLoading from '@/components/s-loading'
import { useModal } from '@/components/s-modal'
import { AccountRoutes } from '@/pages/account/routes'
import NotFound from '@/pages/mange/error/not-found'
import { MangeRoutes } from '@/pages/mange/routes'

export default function Pages () {
  const modal = useModal()

  const router = createBrowserRouter(
    [
      ...MangeRoutes,
      ...AccountRoutes,
      { path: '/*', element: <NotFound /> }
    ]
  )

  useEffect(() => {
    window.__info_modal = modal.info
  }, [modal])

  return (
    <Suspense fallback={<SLoading />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
