import { useEffect } from 'react'
import { useDebounceFn, useRequest } from 'ahooks'
import { Flex, Form } from 'antd'

import { BlockUpdateApi } from '@/api/design/block-update'
import { SectionUpdateApi } from '@/api/design/section-update'
import components from '@/pages/mange/design/right/components'
import { useDesignState } from '@/pages/mange/design/state'

import styles from './index.module.less'

export default function Right () {
  const state = useDesignState(state => state)
  const updateBlock = useRequest(BlockUpdateApi, { manual: true })
  const updateSection = useRequest(SectionUpdateApi, { manual: true })

  const [form] = Form.useForm()

  const hiddenStyle = (state.device === 'fill' || !state.editing)
    ? { width: 0, opacity: 0 }
    : {}

  const onUpdate = useDebounceFn(async (key: string, value: any) => {
    if (!key) return
    if (state.editing?.type === 'section') {
      await updateSection.runAsync({
        section_id: state.editing?.id || '',
        key,
        value,
        part_name: state.editing?.part_name || ''
      })
    } else if (state.editing?.type === 'block') {
      await updateBlock.runAsync({
        block_id: state.editing?.id || '',
        section_id: state.editing?.parent || '',
        part_name: state.editing?.part_name || '',
        key,
        value
      })
    }
    state.setUpdate({
      section_id: state?.editing?.parent || state?.editing?.id,
      block_id: state?.editing?.id,
      key,
      value,
      part_name: state.editing?.part_name || ''
    })
  }, { wait: 400 }).run

  const onValuesChange = (item: Record<string, any>) => {
    const key = Object.keys(item)[0]
    const value = Object.values(item)[0]
    onUpdate(key, value === undefined ? '' : value)
  }

  useEffect(() => {
    const settings: any = {}
    state.editing?.schema?.forEach(i => {
      settings[i.id] = i.__kimi_value
    })
    form.setFieldsValue(settings)
  }, [state.editing])

  return (
    <Flex style={hiddenStyle} vertical className={styles.container}>
      <Flex className={styles.title}>
        {state.editing?.name}
      </Flex>
      <Form onValuesChange={onValuesChange} form={form}>
        <Flex gap={28} vertical className={styles.right}>
          {
            state?.editing?.schema?.map((i, index) => {
              const Component = (components as any)[i?.type]
              if (!Component) return <div key={index}>{i.type}</div>
              return (
                <Form.Item name={i.id} key={i.id}>
                  <Component setting={i} />
                </Form.Item>
              )
            })
          }
        </Flex>
      </Form>
    </Flex>
  )
}
