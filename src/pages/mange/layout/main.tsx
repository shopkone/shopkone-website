import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import SLoading from '@/components/s-loading'

import styles from './index.module.less'

export default function Main () {
  return (
    <main id={'shopkimi-main'} className={styles.main}>
      <Suspense fallback={<SLoading />}>
        <Outlet />
      </Suspense>
    </main>
  )
}
