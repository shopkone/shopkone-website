import { Checkbox, Tooltip } from 'antd'

import SRender from '@/components/s-render'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'

export interface ColumnPriceProps {
  onChange: (is: boolean) => void
  row: Variant
  type: 'tax_required' | 'shipping_required'
}

export default function ColumnRequired (props: ColumnPriceProps) {
  const { onChange, row, type } = props

  const allChecked = row?.children?.every(i => i?.[type])
  const someChecked = row?.children?.some(i => i?.[type])

  return (
    <div>
      <SRender render={row.children?.length}>
        <Tooltip title={`Applies to all ${row?.children?.length} variants`}>
          <Checkbox indeterminate={!allChecked && someChecked} checked={allChecked} onChange={e => { onChange(e.target.checked) }}>
            {
              type === 'shipping_required' ? 'Required' : 'Charge tax'
            }
          </Checkbox>
        </Tooltip>
      </SRender>
      <SRender render={!row.children?.length}>
        <Checkbox checked={row[type]} onChange={e => { onChange(e.target.checked) }}>
          {
            type === 'shipping_required' ? 'Required' : 'Charge tax'
          }
        </Checkbox>
      </SRender>
    </div>
  )
}
