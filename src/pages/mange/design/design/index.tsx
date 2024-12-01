import { Flex } from 'antd'

import Content from '@/pages/mange/design/content'
import Header from '@/pages/mange/design/header'
import Right from '@/pages/mange/design/right'
import Side from '@/pages/mange/design/side'

import styles from './index.module.less'

export default function Design () {
  return (
    <div className={styles.container}>
      <Header />
      <Flex className={styles.main}>
        <Side />
        <Content />
        <Right />
      </Flex>
    </div>
  )
}
