import { useDesignState } from '@/pages/mange/design/state'

import styles from './index.module.less'

export default function Right () {
  const state = useDesignState(state => state)

  const hiddenStyle = state.device === 'fill'
    ? { width: 0, opacity: 0 }
    : {}

  return (
    <div style={hiddenStyle} className={styles.right}>
      right
    </div>
  )
}
