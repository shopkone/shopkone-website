import { IconChevronDown } from '@tabler/icons-react'
import { Flex, Input } from 'antd'

import SRender from '@/components/s-render'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'

import styles from './index.module.less'

export interface ColumnTextProps {
  onChange: (value: string) => void
  value: string
  row: Variant
  type: 'sku' | 'barcode'
  setExpands: (expands: number[]) => void
  expands: number[]
}

export default function ColumnText (props: ColumnTextProps) {
  const { value, onChange, row, type, setExpands, expands } = props

  const setExpandsHandle = () => {
    if (expands.includes(row.id)) {
      setExpands(expands.filter(id => id !== row.id))
    } else {
      setExpands([...expands, row.id])
    }
  }

  return (
    <div>
      <SRender onClick={setExpandsHandle} render={row.children?.length} className={styles.link}>
        <Flex className={styles.link} align={'center'} gap={4}>
          {row.children?.reduce((pre, cur) => pre + Number(!!cur[type]), 0)} / {row.children?.length}
          <IconChevronDown
            className={styles.downIcon}
            style={{ transform: expands?.includes(row.id) ? 'rotate(-180deg)' : 'rotate(0deg)' }}
            size={13}
          />
        </Flex>
      </SRender>

      <SRender render={!row.children?.length}>
        <Input
          onChange={e => { onChange(e.target.value) }}
          autoComplete={'off'}
          value={value}
        />
      </SRender>
    </div>
  )
}
