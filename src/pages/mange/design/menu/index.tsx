import { IconLayoutGridAdd, IconLayoutList, IconSettings } from '@tabler/icons-react'
import { Flex } from 'antd'

import IconButton from '@/components/icon-button'

import styles from './index.module.less'

export default function Menu () {
  return (
    <Flex align={'center'} vertical className={styles.menu}>
      <IconButton type={'text'} size={40}>
        <IconLayoutList size={18} />
      </IconButton>
      <IconButton type={'text'} size={40}>
        <IconSettings size={18} />
      </IconButton>
      <IconButton type={'text'} size={40}>
        <IconLayoutGridAdd size={18} />
      </IconButton>
    </Flex>
  )
}
