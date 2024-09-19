import { Flex, Tag } from 'antd'

import { Options } from '@/pages/mange/product/product/product-change/variants/variant-changer/index'

import styles from './index.module.less'

export interface DoneItemProps {
  option: Options
  onClick: () => void
}

export default function DoneItem (props: DoneItemProps) {
  const { option, onClick } = props
  return (
    <div
      onClick={onClick} className={styles['done-item']}
    >
      <div className={styles['done-item-title']}>{option.name}</div>
      <Flex wrap={'wrap'} gap={8} style={{ marginTop: 8 }}>
        {
            option.values?.filter(i => i.value).map(i => (
              <Tag style={{ fontSize: 12, marginRight: -2 }} key={i.id}>
                {i.value}
              </Tag>
            ))
          }
      </Flex>
    </div>
  )
}
