import { useMemo } from 'react'
import { Flex } from 'antd'

import { useDesignState } from '@/pages/mange/design/state'

import styles from './index.module.less'

export default function Content () {
  const state = useDesignState(state => state)

  const width = useMemo(() => {
    if (state.device === 'desktop') return '100%'
    if (state.device === 'fill') return '100%'
    if (state.device === 'pad') return 768
    if (state.device === 'mobile') return 395
  }, [state.device])

  return (
    <Flex justify={'center'} className={styles.content}>
      <iframe
        style={{ width }}
        className={styles.iframe}
        src={'http://localhost:3100'}
      />
    </Flex>
  )
}
