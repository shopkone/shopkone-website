import { HamburgerButton } from '@icon-park/react'
import { Button, Tooltip } from 'antd'

import styles from './index.module.less'

export default function Actions () {
  return (
    <Tooltip title={'Edit Header'}>
      <Button
        size={'small'}
        className={styles.btn}
      >
        <HamburgerButton size={14} className={styles.icon} />
      </Button>
    </Tooltip>
  )
}
