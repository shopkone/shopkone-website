import { IconMenu2 } from '@tabler/icons-react'
import { Button } from 'antd'

import styles from './index.module.less'

export default function Actions () {
  return (
    <Button
      size={'small'}
      className={styles.btn}
      style={{ padding: 0, width: 24, height: 24, borderRadius: 6 }}
    >
      <IconMenu2 size={15} className={styles.icon} />
    </Button>
  )
}
