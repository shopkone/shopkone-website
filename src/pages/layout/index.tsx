import Header from '@/pages/layout/header'
import Main from '@/pages/layout/main'
import Sider from '@/pages/layout/sider'

import styles from './index.module.less'

export default function Layout () {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.content}>
        <Sider />
        <Main />
      </div>
    </div>
  )
}
