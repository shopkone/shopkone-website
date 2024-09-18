import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import styles from './index.module.less'

export default function Main () {
  return (
    <main className={styles.main}>
      <Suspense fallback={'Loading...'}>
        <Outlet />
      </Suspense>
    </main>
  )
}
