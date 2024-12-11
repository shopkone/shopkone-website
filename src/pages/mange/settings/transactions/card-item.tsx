import { Flex } from 'antd'
import classNames from 'classnames'

import styles from '@/pages/mange/settings/transactions/index.module.less'

export interface CardItemProps {
  options: Array<{ title: string, desc: string, value: number | boolean }>
  value?: number
  onChange?: (value: number | boolean) => void
}

export default function CardItem (props: CardItemProps) {
  const { options, value, onChange } = props

  return (
    <Flex>
      {
        options.map(item => (
          <div
            onClick={() => onChange?.(item.value)}
            key={item.value.toString()}
            className={classNames(styles.card, { [styles.active]: item.value === value })}
          >
            <div className={styles.name}>
              {item.title}
            </div>
            <div className={styles.desc}>
              {item.desc}
            </div>
          </div>
        ))
      }
    </Flex>
  )
}
