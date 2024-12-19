import { Flex } from 'antd'

import Content from '@/pages/mange/design/content'
import Header from '@/pages/mange/design/header'
import Menu from '@/pages/mange/design/menu'
import Right from '@/pages/mange/design/right'
import SettingRight from '@/pages/mange/design/setting-right'
import Side from '@/pages/mange/design/side'

import styles from './index.module.less'

export default function Design () {
  return (
    <div className={styles.container}>
      <Header />
      <Flex className={styles.main}>
        <Menu />
        <Side />
        <Content />
        <Right />
        <SettingRight />
      </Flex>
    </div>
  )
}
