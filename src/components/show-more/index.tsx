import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import { Flex } from 'antd'

import SRender from '@/components/s-render'

import styles from './index.module.less'

export interface ShowMoreProps<T> {
  maxCount: number
  children: (item: T, index: number) => ReactNode
  items: T[]
}

export default function ShowMore<T> (props: ShowMoreProps<T>) {
  const { maxCount, children, items } = props
  const [expand, setExpand] = useState(false)
  const { t } = useTranslation('common', { keyPrefix: 'showMore' })
  return (
    <div className={styles.container}>
      {
        items?.filter((_, index) => index < maxCount || expand).map((item, index) => (
          <div key={index}>
            {children(item, index)}
          </div>
        ))
      }
      <SRender className={styles.shadow} render={(items?.length || 0) > maxCount && !expand}>
        <Flex onClick={() => { setExpand(true) }} gap={4} align={'center'} className={styles.text}>
          {t('展开剩余x项', { x: items?.length - maxCount })}
          <div style={{ position: 'relative', top: 3 }}>
            <IconChevronDown color={'#000'} size={14} />
          </div>
        </Flex>
      </SRender>

      <SRender className={styles.shadow} style={{ background: 'none', minHeight: 0, bottom: -10 }} render={expand}>
        <Flex onClick={() => { setExpand(false) }} gap={4} align={'center'} className={styles.text}>
          {t('收起')}
          <div style={{ position: 'relative', top: 3 }}>
            <IconChevronUp color={'#000'} size={14} />
          </div>
        </Flex>
      </SRender>

      <SRender style={{ margin: '32px 0 16px 0' }} render={expand}>
        <div className={'line'} />
      </SRender>
    </div>
  )
}
