import { Tooltip } from 'antd'

import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'
import { formatPrice } from '@/utils/num'

export interface ColumnPriceProps {
  item: Variant
}

export default function ColumnPrice (props: ColumnPriceProps) {
  const { item } = props

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
            value={getPriceRange(item?.children?.map(i => i.price))?.value}
            placeholder={getPriceRange(item?.children?.map(i => i.price))?.placeHolder}
          />
        </Tooltip>
      </SRender>
      <SRender render={!item.isParent}>
        <SInputNumber
          money
          placeholder={'0.00'}
          value={item.price}
        />
      </SRender>
    </div>
  )
}
