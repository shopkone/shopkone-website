import { Button, Card, Flex } from 'antd'

import { useOpen } from '@/hooks/useOpen'
import Changer from '@/pages/mange/product/product/product-change/variants/changer'
import Tables from '@/pages/mange/product/product/product-change/variants/tables'

import styles from './index.module.less'

export default function Variants () {
  const openInfo = useOpen()

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
          <Button onClick={() => { openInfo.edit() }} size={'small'} className={'primary-text'} type={'text'}>
            Edit options
          </Button>
        </Flex>
      }
    >
      <Tables />
      <Changer info={openInfo} />
    </Card>
  )
}
