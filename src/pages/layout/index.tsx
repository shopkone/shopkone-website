import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import NotFound from '@/pages/error/not-found'
import Header from '@/pages/layout/header'
import Main from '@/pages/layout/main'
import Sider from '@/pages/layout/sider'
import { ProductRoutes } from '@/pages/product/product/routes'

import styles from './index.module.less'

export default function Layout () {
  const Content = (
    <div className={styles.layout}>
      <Header />
      <div className={styles.content}>
        <Sider />
        <Main />
      </div>
    </div>
  )

  const routes = createBrowserRouter(
    [{
      path: '/',
      element: Content,
      children: [...ProductRoutes, { path: '/*', element: <NotFound /> }]
    }]
  )

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={routes} />
    </Suspense>
  )
}
