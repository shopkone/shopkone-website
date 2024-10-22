import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import SLoading from '@/components/s-loading'
import { useLoadResource } from '@/i18n/useLoadResource'

export default function Container () {
  const { loading } = useLoadResource('product')

  if (loading) return <SLoading />

  return (
    <Suspense fallback={<SLoading />}>
      <Outlet />
    </Suspense>
  )
}
