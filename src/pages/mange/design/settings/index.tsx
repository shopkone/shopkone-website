import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Flex } from 'antd'
import classNames from 'classnames'

import { DesignGetConfig } from '@/api/design/config-get'
import { SectionSchema } from '@/api/design/schema-list'
import SLoading from '@/components/s-loading'
import SRender from '@/components/s-render'
import { useNav } from '@/hooks/use-nav'
import { useDesignState } from '@/pages/mange/design/state'

import styles from './index.module.less'

export default function Settings () {
  const config = useRequest(DesignGetConfig)
  const nav = useNav()
  const update = useDesignState(state => state.updateSettingRight)
  const { search } = useLocation()

  const onSelect = (item: SectionSchema) => {
    nav(`?global=${item.name}`)
  }

  useEffect(() => {
    if (!search?.includes('global')) return
    const item = config?.data?.schema?.find(item => decodeURI(search)?.includes(item.name))
    if (!item) return
    const settings = item?.settings?.map(setting => {
      const __kimi_value = config?.data?.data[setting.id]
      return { ...setting, __kimi_value }
    })
    update({ ...item, settings })
  }, [search])

  return (
    <Flex className={styles.container} vertical>
      <SRender render={config.loading} style={{ height: 400 }}>
        <SLoading loading={config.loading} />
      </SRender>
      <div>
        {
          config.data?.schema?.map((item, index) => (
            <SRender key={item.name} render={index}>
              <div
                onClick={() => { onSelect(item) }}
                className={
                classNames(
                  styles.item,
                  { [styles.active]: decodeURI(search)?.includes(item.name) }
                )
                }
              >
                {item.name}
              </div>
            </SRender>
          ))
        }
      </div>
    </Flex>
  )
}
