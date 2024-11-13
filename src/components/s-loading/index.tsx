import { ReactNode } from 'react'
import { IconLoader2 } from '@tabler/icons-react'
import { Spin } from 'antd'
import classNames from 'classnames'

import styles from './index.module.less'

export interface SLoadingProps {
  text?: ReactNode
  size?: number
  black?: boolean
  loading?: boolean
  minHeight?: number
  children?: ReactNode
  foreShow?: boolean
  className?: string
  style?: React.CSSProperties
}

export default function SLoading (props: SLoadingProps) {
  const { text, size = 36, black, loading = true, minHeight, children, foreShow, className, style } = props

  const loadingComponent = (
    <div
      className={classNames(styles.wrapper, className)}
      style={{
        opacity: loading ? 1 : 0,
        display: loading ? undefined : 'none',
        minHeight,
        ...style
      }}
    >
      <IconLoader2 className={styles.loading} color={black ? '#1F2329' : '#1456f0'} size={size} />
      {text ? <span className={styles.lint}>{text}</span> : null}
    </div>
  )

  if (children) {
    return (
      <Spin
        rootClassName={styles.animation}
        spinning={loading}
        delay={100}
        indicator={
          <div><IconLoader2 className={styles.loading} size={size} /></div>
        }
      >
        <div
          className={`fit-width fit-height ${styles.animation}`}
          style={{ opacity: loading ? (foreShow ? 1 : 0) : 1, flexShrink: 0 }}
        >
          {children}
        </div>
      </Spin>
    )
  }

  return loadingComponent
}
