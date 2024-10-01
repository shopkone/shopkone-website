import { IconChevronDown } from '@tabler/icons-react'
import { Flex, Select, Tooltip } from 'antd'

import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import { WEIGHT_UNIT_OPTIONS } from '@/constant/product'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'

import styles from './index.module.less'

export interface ColumnWeightProps {
  row: Variant
  onChange: (value?: Variant) => void
}

export default function ColumnWeight (props: ColumnWeightProps) {
  const { row, onChange } = props
  return (
    <div>
      <SRender render={row.isParent}>
        <Tooltip title={`Applies to all ${row?.children?.length} variants`}>
          <div style={{ position: 'relative' }}>
            <SInputNumber
              value={row.weight}
              placeholder={'0'}
              onChange={(v) => {
              }}
            />
            <Flex
              className={styles['weight-select-wrapper']}
              align={'center'}
              justify={'center'}
            >
              <Select
                value={[...new Set(row?.children?.map(i => i.weight_uint))].join('/')}
                onChange={(v) => {
                }}
                style={{ padding: 0 }}
                variant={'borderless'}
                size={'small'}
                suffixIcon={<IconChevronDown className={styles['weight-select']} size={14} />}
                options={WEIGHT_UNIT_OPTIONS}
              />
            </Flex>
          </div>
        </Tooltip>
      </SRender>
      <SRender render={!row.isParent}>
        <div style={{ position: 'relative' }}>
          <SInputNumber
            value={row.weight}
            placeholder={'0'}
            onChange={(v) => {
              onChange({ ...row, weight: v })
            }}
          />
          <Flex
            className={styles['weight-select-wrapper']}
            align={'center'}
            justify={'center'}
          >
            <Select
              value={row?.weight_uint}
              onChange={(v) => {
                onChange({ ...row, weight_uint: v })
              }}
              style={{ padding: 0 }}
              variant={'borderless'}
              size={'small'}
              suffixIcon={<IconChevronDown className={styles['weight-select']} size={14} />}
              options={WEIGHT_UNIT_OPTIONS}
            />
          </Flex>
        </div>
      </SRender>
    </div>
  )
}
