import { Tooltip } from 'antd'

import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'
import { formatPrice } from '@/utils/num'

export interface ColumnPriceProps {
  item: Variant
  type: 'price' | 'compare_at_price' | 'cost_per_item'
  onChange: (value?: Variant) => void
}

export default function ColumnPrice (props: ColumnPriceProps) {
  const { item, type, onChange } = props

  const getPriceRange = (prices?: Array<number | undefined>) => {
    const list = (prices?.filter(i => typeof i === 'number') || []) as number[]
    if (!list?.length) return { value: undefined, placeHolder: '0.00' }
    const max = Math.max(...list)
    const min = Math.min(...list)
    if (min === max) {
      return { value: max, placeHolder: undefined }
    }
    return {
      placeHolder: [formatPrice(min), formatPrice(max)].join(' - '),
      value: undefined
    }
  }

  return (
    <div>
      <SRender render={item.isParent}>
        <Tooltip title={`Applies to all ${item?.children?.length} variants`}>
          <SInputNumber
            money
            value={getPriceRange(item?.children?.map(i => i[type]))?.value}
            placeholder={getPriceRange(item?.children?.map(i => i[type]))?.placeHolder}
          />
        </Tooltip>
      </SRender>
      <SRender render={!item.isParent}>
        <SInputNumber
          onChange={(v) => { onChange({ ...item, [type]: v }) }}
          money
          placeholder={'0.00'}
          value={item[type]}
        />
      </SRender>
    </div>
  )
}
