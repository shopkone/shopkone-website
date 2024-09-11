import { Card, Flex } from 'antd'

import Status from '@/components/status'

import styles from './index.module.less'

export default function Publishing () {
  return (
    <Card className={'fit-width'} title={'Publishing'}>
      <div className={`${styles.title} mt4`}>Sales channels</div>
      <Status>
        Online Store
      </Status>
      <Status>
        Point of Sale
      </Status>
      <div className={`${styles.title} ${styles.mt12}`}>Markets</div>
      <Flex gap={4} vertical>
        <Status>
          在线上传
        </Status>
        <Status>
          在线上传
        </Status>
      </Flex>
    </Card>
  )
}
