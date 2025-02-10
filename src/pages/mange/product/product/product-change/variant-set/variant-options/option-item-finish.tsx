import { Flex } from 'antd'

import { OptionValue } from '@/pages/mange/product/product/product-change/variant-set/variant-options/option-item'

import styles from './index.module.less'

export interface OptionItemFinishProps {
  value: OptionValue
  onEdit: () => void
}

export default function OptionItemFinish (props: OptionItemFinishProps) {
  const { value, onEdit } = props

  return (
    <div onClick={onEdit} className={styles.finishedStatus}>
      <Flex className={'fit-width'} vertical align={'flex-start'} justify={'flex-start'}>
        <div>{value.label}</div>

        <Flex gap={12} wrap={'wrap'} style={{ marginTop: 12 }}>
          {
            value.values.filter(item => item.value).map(item => (
              <div className={styles.tag} key={item.id}>{item.value}</div>
            ))
          }
        </Flex>
      </Flex>
    </div>
  )
}
