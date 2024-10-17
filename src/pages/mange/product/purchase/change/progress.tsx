import styles from '@/pages/mange/product/purchase/change/index.module.less'

export default function Progress () {
  return (
    <div className={styles.progressWrapper}>
      <div
        className={styles.progress}
        style={{
          background: '#2e7d32',
          width: '50%',
          zIndex: 1
        }}
      />
      <div
        className={styles.progress}
        style={{
          background: '#d32f2f',
          width: '100%'
        }}
      />
    </div>
  )
}
