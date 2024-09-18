import { ArrowLeft } from '@icon-park/react'
import { Button, Flex } from 'antd'

import styles from './index.module.less'

export interface PageProps {
  children: React.ReactNode
  width?: number
  header?: React.ReactNode
  footer?: React.ReactNode
}

export default function Page (props: PageProps) {
  const { children, width, header, footer } = props
  return (
    <div style={{ maxWidth: width, margin: '0 auto' }}>
      <Flex align={'center'} justify={'space-between'} className={styles.title}>
        <Flex gap={4} align={'center'}>
          <Button type={'text'} className={styles['back-icon']}>
            <ArrowLeft strokeWidth={5} size={16} />
          </Button>
          <div style={{ fontSize: 20 }}>Close sadasdgadfc</div>
        </Flex>
        <div className={styles.header}>
          {header}
        </div>
      </Flex>
      {children}
      <Flex gap={12} align={'center'} className={styles.footer}>
        {footer}
        <Button type={'primary'}>Save</Button>
      </Flex>
    </div>
  )
}
