import { Flex } from 'antd'

import styles from '@/pages/mange/product/purchase/change/index.module.less'
import { reduce, sum } from '@/utils'

export interface DetailProps {
  vertical?: boolean
  rejected?: number
  received?: number
  purchasing?: number
}

export default function Detail (props: DetailProps) {
  const { vertical, rejected, received, purchasing } = props
  return (
    <Flex vertical={vertical} gap={16} justify={'flex-end'}>
      <Flex gap={4} align={'center'}>
        <div style={{ background: '#2e7d32' }} className={styles.progressBlock} />
        已入库
        <span>({received})</span>
      </Flex>
      <Flex gap={4} align={'center'}>
        <div style={{ background: '#d32f2f' }} className={styles.progressBlock} />
        已拒收
        <span>({rejected})</span>
      </Flex>
      <Flex gap={4} align={'center'}>
        <div style={{ background: '#c6c6c6' }} className={styles.progressBlock} />
        未处理
        <span>({reduce(purchasing, received, rejected) > 0 ? reduce(purchasing, received, rejected) : 0})</span>
      </Flex>
      <Flex gap={4} align={'center'}>
        <span>总额</span>
        <span>{sum(rejected, received)} / {purchasing}</span>
      </Flex>
    </Flex>
  )
}
