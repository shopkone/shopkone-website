import { ReactNode } from 'react'
import { LoadingFour } from '@icon-park/react'

import styles from './index.module.less'

export interface SLoadingProps {
  text?: ReactNode
  size?: number
  black?: boolean
  loading?: boolean
}

export default function SLoading (props: SLoadingProps) {
  const { text, size = 36, black, loading = true, } = props

  return (
    <div className={styles.wrapper} style={{ opacity: loading ? 1 : 0, display: loading ? undefined : 'none' }}>
      <LoadingFour className={styles.loading} spin fill={black ? '#1F2329' : '#1456f0'} size={size} />
      {text ? <span className={styles.lint}>{text}</span> : null}
    </div>
  )
}
