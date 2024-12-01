import { Flex } from 'antd'

import components from '@/pages/mange/design/right/components'
import { useDesignState } from '@/pages/mange/design/state'

import styles from './index.module.less'

export default function Right () {
  const state = useDesignState(state => state)

  const hiddenStyle = (state.device === 'fill' || !state.editing)
    ? { width: 0, opacity: 0 }
    : {}

  return (
    <Flex style={hiddenStyle} vertical className={styles.container}>
      <Flex className={styles.title}>
        {state.editing?.name}
      </Flex>
      <Flex gap={28} vertical className={styles.right}>
        {
          state?.editing?.schema?.map((i, index) => {
            const Component = (components as any)[i?.type]
            if (!Component) return <div key={index}>{i.type}</div>
            return <Component setting={i} key={index} />
          })
        }
      </Flex>
    </Flex>
  )
}
