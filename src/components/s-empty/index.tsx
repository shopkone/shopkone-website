import { ReactNode, useEffect, useState } from 'react'
import { Flex } from 'antd'
import classNames from 'classnames'

import styles from './index.module.less'

export interface EmptyProps {
  children?: ReactNode
  title?: string
  desc?: ReactNode
  image?: ReactNode
  height?: number
  type?: keyof typeof emptyMap
}

const emptyMap = {
  err_404: async () => await import('@/assets/empty/err_404.svg').then(module => module.ReactComponent),
  empty_product: async () => await import('@/assets/empty/empty_product.svg').then(module => module.ReactComponent),
  empty_order: async () => await import('@/assets/empty/empty_order.svg').then(module => module.ReactComponent)
}

export default function SEmpty (props: EmptyProps) {
  const [ImageComponent, setImageComponent] = useState<ReactNode>()

  const defaultImage = ImageComponent || ''

  const { title, desc, image = defaultImage, children, height } = props

  useEffect(() => {
    if (!props.type) {
      if (props.image) {
        return
      }
    }
    emptyMap[props.type || 'err_404']?.().then(Component => {
      // @ts-expect-error
      Component && setImageComponent(Component)
    })
  }, [props.type])

  return (
    <Flex
      gap={4}
      vertical
      style={{ height }}
      className={classNames(styles.container, { [styles.customerImg]: !!props.image })}
    >
      <div className={styles.image}>
        {props.image || image}
      </div>
      <Flex gap={16} vertical align={'center'} justify={'center'}>
        <div className={styles.title}>{title}</div>
        <div className={styles.desc} style={{ fontSize: 13 }}>{desc}</div>
        <div style={{ marginTop: props.image ? 0 : 16 }}>
          {children}
        </div>
      </Flex>
    </Flex>
  )
}
