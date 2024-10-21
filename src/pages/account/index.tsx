import { Suspense, useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import SLoading from '@/components/s-loading'
import { useLoadLanguage } from '@/hooks/use-lang'
import { AccountRoutes } from '@/pages/account/routes'
import { useLayoutState } from '@/pages/mange/layout/state'

export default function Account () {
  const { language, t } = useLoadLanguage('account')
  const setT = useLayoutState(state => state.setT)
  const accountRoutes = createBrowserRouter(
    AccountRoutes,
    { basename: '/accounts/' }
  )

  useEffect(() => {
    if (!t || !language) return
    setT(t)
  }, [t, language])

  if (language.loading) return <SLoading />

  return (
    <Suspense fallback={<SLoading />}>
      <RouterProvider router={accountRoutes} />
    </Suspense>
  )
}
