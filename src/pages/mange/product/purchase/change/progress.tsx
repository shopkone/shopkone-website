import { Tooltip } from 'antd'

import SRender from '@/components/s-render'
import styles from '@/pages/mange/product/purchase/change/index.module.less'

export interface ProgressProps {
  rejected?: number
  received?: number
  purchasing?: number
}

export default function Progress (props: ProgressProps) {
  const { rejected = 0, received = 0, purchasing = 0 } = props

  let remaining = purchasing - received - rejected
  remaining = remaining > 0 ? remaining : 0

  return (
    <div className={styles.progressWrapper}>
      <SRender render={received}>
        <Tooltip mouseEnterDelay={0} title={`已入库 (${received})`}>
          <div className={styles.progress} style={{ background: '#2e7d32', flex: received }} />
        </Tooltip>
      </SRender>
      <SRender render={rejected}>
        <Tooltip mouseEnterDelay={0} title={`已拒收 (${rejected})`}>
          <div
            className={styles.progress}
            style={{
              background: '#d32f2f',
              flex: rejected,
              marginLeft: Number(!!rejected),
              marginRight: Number(!!rejected)
            }}
          />
        </Tooltip>
      </SRender>
      <SRender render={remaining}>
        <Tooltip mouseEnterDelay={0} title={`未处理 (${purchasing})`}>
          <div className={styles.progress} style={{ background: '#c6c6c6', flex: remaining }} />
        </Tooltip>
      </SRender>
    </div>
  )
}
