import { Button, Card, Flex } from 'antd'

import Changer from '@/pages/mange/product/product/product-change/variants/changer'
import Tables from '@/pages/mange/product/product/product-change/variants/tables'

import styles from './index.module.less'

export default function Variants () {
  return (
    <Card
      bordered
      className={styles.container}
      title={'Variants'}
      extra={
        <Flex gap={8}>
          <Button style={{ padding: '0 6px', height: 24 }} type={'text'} size={'small'}>
            Set columns
          </Button>
          <Button size={'small'} className={'primary-text'} type={'text'}>
            Edit options
          </Button>
        </Flex>
      }
    >
      <Tables />
      <Changer />
    </Card>
  )
}
