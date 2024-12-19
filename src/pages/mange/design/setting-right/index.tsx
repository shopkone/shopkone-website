import { useEffect } from 'react'
import { useRequest } from 'ahooks'
import { Flex, Form } from 'antd'

import { DesignConfigUpdateApi } from '@/api/design/config-update'
import components from '@/pages/mange/design/right/components'
import { useDesignState } from '@/pages/mange/design/state'

import styles from './index.module.less'

export default function SettingRight () {
  const settingConfig = useDesignState(state => state.settingRight)
  const update = useRequest(DesignConfigUpdateApi, { manual: true })
  const [form] = Form.useForm()
  const device = useDesignState(state => state.device)
  const iframe = useDesignState(state => state.iframe)

  const onValuesChange = async (obj: any) => {
    const key = Object.keys(obj)?.[0]
    if (!key) return
    const value = Object.values(obj)[0]
    await update.runAsync({ key, value })
    iframe.send('RELOAD')
  }

  useEffect(() => {
    const settings: any = {}
    settingConfig?.settings.forEach(i => {
      settings[i.id] = i.__kimi_value
    })
    form.setFieldsValue(settings)
  }, [settingConfig])

  if (!settingConfig?.settings) return null
  if (device === 'fill') return null

  return (
    <Flex vertical className={styles.side}>
      <Flex className={styles.title}>
        {settingConfig?.name}
      </Flex>
      <div className={styles.right}>
        <Form onValuesChange={onValuesChange} form={form}>
          <Flex gap={18} vertical>
            {
              settingConfig?.settings.map((i, index) => {
                const Component = (components as any)[i?.type]
                if (!Component) return <div key={index}>{i.type}</div>
                return (
                  <Form.Item noStyle className={'mb0'} name={i.id} key={i.id}>
                    <Component isFirst={index === 0} setting={i} />
                  </Form.Item>
                )
              })
            }
          </Flex>
        </Form>
        <div style={{ height: 100 }} />
      </div>
    </Flex>
  )
}
