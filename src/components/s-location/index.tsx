import { LocalTwo } from '@icon-park/react'
import { Flex } from 'antd'
import classNames from 'classnames'

import styles from './index.module.less'

export interface SLocationProps {
  onClick?: () => void
  extra?: React.ReactNode
}

export default function SLocation (props: SLocationProps) {
  const { onClick, extra } = props
  return (
    <div className={styles.container}>
      <Flex
        gap={16}
        align={'center'}
        className={classNames([styles.item, { [styles['click-item ']]: !!onClick }])}
      >
        <div style={{ width: 20, position: 'relative', top: 2 }}>
          <LocalTwo size={17} strokeWidth={5} />
        </div>
        <div className={'flex1'}>
          <div className={styles.title}>asd</div>
          <div>
            {
              ['Full address Apartment, suite, etc City, 123552 Beijing, China'].join(',')
            }
          </div>
        </div>
        {extra}
      </Flex>
    </div>
  )
}
