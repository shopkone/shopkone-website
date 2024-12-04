import { useDebounceFn, useRequest } from 'ahooks'
import { Flex } from 'antd'

import { BlockUpdateApi } from '@/api/design/block-update'
import components from '@/pages/mange/design/right/components'
import { useDesignState } from '@/pages/mange/design/state'

import styles from './index.module.less'

export default function Right () {
  const state = useDesignState(state => state)
  const updateBlock = useRequest(BlockUpdateApi, { manual: true })

  const hiddenStyle = (state.device === 'fill' || !state.editing)
    ? { width: 0, opacity: 0 }
    : {}

  const onUpdate = useDebounceFn(async (key: string, value: any) => {
    if (!key) return
    await updateBlock.runAsync({
      block_id: state.editing?.id || '',
      section_id: state.editing?.parent || '',
      part_name: state.editing?.part_name || '',
      key,
      value
    })
    state.setContentFresh()
  }, { wait: 400 }).run

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
            return <Component onChange={onUpdate} setting={i} key={index} />
          })
        }
      </Flex>
    </Flex>
  )
}
