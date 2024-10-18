import styles from '@/pages/mange/product/purchase/change/index.module.less'

export interface ProgressProps {
  rejected?: number
  received?: number
  purchasing?: number
}

export default function Progress (props: ProgressProps) {
  const { rejected = 0, received = 0, purchasing = 1 } = props

  const remaining = purchasing - received - rejected

  console.log(purchasing)

  return (
    <div className={styles.progressWrapper}>
      <div className={styles.progress} style={{ background: '#2e7d32', flex: received }} />
      <div className={styles.progress} style={{ background: '#d32f2f', flex: rejected, marginLeft: 1, marginRight: 1 }} />
      <div className={styles.progress} style={{ background: '#c6c6c6', flex: remaining > 0 ? remaining : 0 }} />
    </div>
  )
}
