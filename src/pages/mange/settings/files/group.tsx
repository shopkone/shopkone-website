import { Plus } from '@icon-park/react'
import { Button, Card, Flex } from 'antd'

import SLoading from '@/components/s-loading'

import styles from './index.module.less'

export default function Group () {
  return (
    <div className={styles.side}>
      <Card
        styles={{ body: { padding: 0 } }}
        className={'fit-height'}
      >
        <div className={styles.sideTitle}>File group</div>
        <SLoading size={'large'}>
          <div className={styles.sideContent}>
            <div className={styles.sideItem}>
              All files
            </div>
          </div>
        </SLoading>
        <div className={styles.sideBottom}>
          <Button block>
            <Flex gap={4} justify={'center'} align={'center'}>
              <Plus size={15} />
              <div style={{ position: 'relative', top: -2 }}>Add group</div>
            </Flex>
          </Button>
        </div>
      </Card>
    </div>
  )
}
