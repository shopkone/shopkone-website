import { Tooltip } from 'antd'

import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import { useI18n } from '@/hooks/use-lang'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'
import { formatPrice } from '@/utils/num'

export interface ColumnPriceProps {
  value: number
  onChange: (value: number | null) => void
  row: Variant
  type: 'price' | 'compare_at_price' | 'cost_per_item'
}

export default function ColumnPrice (props: ColumnPriceProps) {
  const { value, onChange, row, type } = props
  const t = useI18n()

  const getPriceRange = (prices?: Array<number | undefined>): any => {
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
      <SRender render={row.children?.length}>
        <Tooltip title={t(`同时修改 ${row?.children?.length} 个款式`)}>
          <SInputNumber
            onChange={e => { onChange(e || null) }}
            money
            value={getPriceRange(row?.children?.map(i => i?.[type]) as any)?.value}
            placeholder={getPriceRange(row?.children?.map(i => i?.[type]) as any)?.placeHolder}
          />
        </Tooltip>
      </SRender>
      <SRender render={!row.children?.length}>
        <SInputNumber value={value} onChange={e => { onChange(e || null) }} money />
      </SRender>
    </div>
  )
}
