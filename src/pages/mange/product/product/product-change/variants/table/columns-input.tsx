import { Input } from 'antd'

import SRender from '@/components/s-render'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'

import styles from './index.module.less'

export interface ColumnsInputProps {
  row: Variant
  type: 'sku' | 'barcode'
}

export default function ColumnsInput (props: ColumnsInputProps) {
  const { row, type } = props
  return (
    <div>
      <SRender onClick={() => {}} render={row.isParent} className={styles['tips-expand']}>
        {row.children?.filter(i => i.sku).length} / {row.children?.length}
      </SRender>
      <SRender render={!row.isParent}>
        <Input
          onChange={(v) => {
          }}
          value={row[type]}
        />
      </SRender>
    </div>
  )
}
