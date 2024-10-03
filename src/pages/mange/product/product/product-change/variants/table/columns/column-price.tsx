import { Tooltip } from 'antd'

import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import { Variant } from '@/pages/mange/product/product/product-change/variants/variant-table'

export interface ColumnPriceProps {
  value: number
  onChange: (value: number | null) => void
  row: Variant
}

export default function ColumnPrice (props: ColumnPriceProps) {
  const { value, onChange, row } = props

  return (
    <div>
      <SRender render={row.children?.length}>
        <Tooltip title={`Applies to all ${row?.children?.length} variants`}>
          <SInputNumber value={value} onChange={e => { onChange(e) }} money />
        </Tooltip>
      </SRender>
      <SRender render={!row.children?.length}>
        <SInputNumber value={value} onChange={e => { onChange(e) }} money />
      </SRender>
    </div>
  )
}
