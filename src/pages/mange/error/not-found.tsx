import { Flex } from 'antd'

import styles from './index.module.less'

export interface NotFoundProps {
  veritcal?: boolean
}

export default function NotFound (props: NotFoundProps) {
  return (
    <Flex gap={24} vertical={props.veritcal} align={'center'} justify={'center'} style={{ height: '100%' }}>
      <div>asd</div>
      <div>
        <div className={styles.title}>There's no page at this address</div>
        <div style={{ fontSize: 14 }}>Check the URL and try again, or use the search bar to find what you need.</div>
      </div>
    </Flex>
  )
}
