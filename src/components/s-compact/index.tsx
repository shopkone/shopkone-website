import { Flex } from 'antd'

import styles from './index.module.less'

export interface SCompactProps {
  children?: React.ReactNode
}

export default function SCompact (props: SCompactProps) {
  const { children } = props
  return (
    <Flex className={styles.compact} align={'center'}>
      {children}
    </Flex>
  )
}
