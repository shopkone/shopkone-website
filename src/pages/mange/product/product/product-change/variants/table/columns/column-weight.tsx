import { IconChevronDown } from '@tabler/icons-react'
import { Tooltip } from 'antd'

import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
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

  const getWeightRange = (prices?: Array<number | undefined>): any => {
    const list = (prices?.filter(i => typeof i === 'number') || []) as number[]
    if (!list?.length) return { value: null }
    const max = Math.max(...list)
    const min = Math.min(...list)
    if (min === max) {
      return { value: max, placeHolder: undefined }
    }
    return {
      placeHolder: [min, max].join(' - '),
      value: undefined
    }
  }

  return (
    <div>
      <SRender render={row?.children?.length}>
        <Tooltip title={`Applies to all ${row?.children?.length} variants`}>
          <SInputNumber
            onChange={v => { onChangeWeight(v || null) }}
            value={getWeightRange(row?.children?.map(i => i.weight) as any)?.value}
            placeholder={getWeightRange(row?.children?.map(i => i.weight) as any)?.placeHolder}
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
      </SRender>

      <SRender render={!row?.children?.length}>
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
      </SRender>
    </div>
  )
}
