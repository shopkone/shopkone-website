import React, { ReactNode } from 'react'
import { LoadingFour } from '@icon-park/react'
import { Spin } from 'antd'

import styles from './index.module.less'

export interface SLoadingProps {
  text?: ReactNode
  size?: number | 'large' | 'small' | 'default'
  black?: boolean
  loading?: boolean
  minHeight?: number
  children?: ReactNode
  foreShow?: boolean
  spinStyle?: React.CSSProperties
}

export default function SLoading (props: SLoadingProps) {
  const { text, size = 36, black, loading = true, minHeight, children, foreShow, spinStyle } = props

  const loadingComponent = (
    <div
      className={styles.wrapper}
      style={{
        opacity: loading ? 1 : 0,
        display: loading ? undefined : 'none',
        minHeight
      }}
    >
      <LoadingFour className={styles.loading} spin fill={black ? '#1F2329' : '#1456f0'} size={size} />
      {text ? <span className={styles.lint}>{text}</span> : null}
    </div>
  )

  if (children) {
    return (
      <Spin
        spinning={loading}
        size={size as any}
        indicator={loadingComponent}
        style={spinStyle}
      >
        <div className={styles.inner} style={{ opacity: loading ? Number(!!foreShow) : 1 }}>{children}</div>
      </Spin>
    )
  }

  return loadingComponent
}
