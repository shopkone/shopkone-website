import { AddressType } from '@/api/common/address'
import SRender from '@/components/s-render'
import { formatAddress } from '@/utils/format'

import styles from './index.module.less'

export interface AddressRenderProps {
  value?: AddressType
}

export default function AddressRender (props: AddressRenderProps) {
  const { value } = props
  return (
    <SRender className={styles.force450} render={!!value} style={{ marginLeft: -0 }}>
      {
        formatAddress(value)
      }
    </SRender>
  )
}
