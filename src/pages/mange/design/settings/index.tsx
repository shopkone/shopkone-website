import { useRequest } from 'ahooks'
import { Flex } from 'antd'

import { DesignGetConfig } from '@/api/design/config-get'
import { SectionSchema } from '@/api/design/schema-list'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import { useDesignState } from '@/pages/mange/design/state'

import styles from './index.module.less'

export default function Settings () {
  const config = useRequest(DesignGetConfig)
  const update = useDesignState(state => state.updateSettingRight)

  const onSelect = (item: SectionSchema) => {
    const settings = item?.settings?.map(setting => {
      const __kimi_value = config?.data?.data[setting.id]
      return { ...setting, __kimi_value }
    })
    update({ ...item, settings })
  }

  return (
    <Flex className={styles.container} vertical>
      <SRender render={config.loading} style={{ height: 400 }}>
        <SLoading loading={config.loading} />
      </SRender>
      <div>
        {
          config.data?.schema?.map((item, index) => (
            <SRender key={item.name} render={index}>
              <div onClick={() => { onSelect(item) }} className={styles.item}>
                {item.name}
              </div>
            </SRender>
          ))
        }
      </div>
    </Flex>
  )
}
