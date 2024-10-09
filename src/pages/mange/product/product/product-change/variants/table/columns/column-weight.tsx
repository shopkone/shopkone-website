import { IconChevronDown } from '@tabler/icons-react'
import { Tooltip } from 'antd'

import SInputNumber from '@/components/s-input-number'
import SSelect from '@/components/s-select'
import { WEIGHT_UNIT_OPTIONS } from '@/constant/product'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'

export interface ColumnWeightProps {
  row: Variant
  onChangeWeight: (weight: number | null) => void
  onChangeWeightUnit: (unit: Variant['weight_unit']) => void
}

export default function ColumnWeight (props: ColumnWeightProps) {
  const { row, onChangeWeight, onChangeWeightUnit } = props

  return (
    <Tooltip title={row?.children?.length ? `Applies to all ${row?.children?.length} variants` : null}>
      <SInputNumber
        onChange={v => { onChangeWeight(v || null) }}
        value={row.weight || undefined}
        suffix={
          <SSelect
            suffixIcon={<IconChevronDown size={13} style={{ position: 'relative', top: 2 }} color={'#646a73'} />}
            onChange={v => { onChangeWeightUnit(v) }}
            value={row.weight_unit}
            onClick={e => { e.stopPropagation() }}
            size={'small'}
            style={{ padding: 0, height: 20, position: 'relative', right: -12, top: -1 }}
            variant={'borderless'}
            options={WEIGHT_UNIT_OPTIONS}
            dropdownStyle={{ width: 100 }}
          />
      }
      />
    </Tooltip>
  )
}
