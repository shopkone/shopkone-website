import { useRequest } from 'ahooks'
import { Flex } from 'antd'

import { DesignGetConfig } from '@/api/design/config-get'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'

import styles from './index.module.less'

export default function Settings () {
  const config = useRequest(DesignGetConfig)
  return (
    <Flex className={styles.container} vertical>
      <SRender render={config.loading} style={{ height: 400 }}>
        <SLoading loading={config.loading} />
      </SRender>
      <div>
        {
          config.data?.schema?.map((item, index) => (
            <SRender key={item.name} render={index}>
              <div className={styles.item}>
                {item.name}
              </div>
            </SRender>
          ))
        }
      </div>
    </Flex>
  )
}
