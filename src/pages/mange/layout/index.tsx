import Header from '@/pages/mange/layout/header'
import Main from '@/pages/mange/layout/main'
import Sider from '@/pages/mange/layout/sider'
import Task from '@/pages/mange/task'

import styles from './index.module.less'

export default function Layout () {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.content}>
        <Sider />
        <Main />
      </div>
      <Task />
    </div>
  )
}
