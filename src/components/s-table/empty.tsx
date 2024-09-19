import { ReactNode } from 'react'
import { Flex } from 'antd'

import NoMsg from '@/assets/image/no-msg.png'

import styles from './index.module.less'

export interface EmptyProps {
  title: string
  desc: string
  actions: ReactNode
}

export default function Empty (props: EmptyProps) {
  const { title, desc, actions } = props
  return (
    <div className={styles.empty}>
      <Flex align={'center'} justify={'space-between'} className={styles.inner}>
        <Flex gap={4} vertical className={styles.left}>
          <div className={styles.title}>{title}</div>
          <div className={styles.desc}>{desc}</div>
          <Flex style={{ marginTop: 16 }}>{actions}</Flex>
        </Flex>
        <div className={styles.right}>
          <img style={{ height: 180 }} src={NoMsg} />
        </div>
      </Flex>
    </div>
  )
}
