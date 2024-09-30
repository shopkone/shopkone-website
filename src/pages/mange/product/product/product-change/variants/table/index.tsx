import { useState } from 'react'
import { Flex } from 'antd'

import STable from '@/components/s-table'
import ByGroup from '@/pages/mange/product/product/product-change/variants/table/by-group'
import { useColumns } from '@/pages/mange/product/product/product-change/variants/table/use-columns'

import { Option, Variant } from '../state'

import styles from './index.module.less'

export interface TableProps {
  value?: Variant[]
  onChange?: (variants: Variant[]) => void
  options: Option[]
}

export default function Table (props: TableProps) {
  const { value = [], onChange, options } = props
  const [groupName, setGroupName] = useState('')
  const [groupVariants, setGroupVariants] = useState<Variant[]>([])

  const { columns, expands, setExpands } = useColumns({
    data: value,
    options,
    onChange: setGroupVariants,
    groupName
  })

  return (
    <div>
      <Flex style={{ marginBottom: 12 }}>
        <ByGroup options={options} value={groupName} onChange={setGroupName} />
      </Flex>
      <STable
        init
        className={styles.table}
        width={916}
        columns={columns}
        data={groupVariants}
        expand={{ value: expands, onChange: setExpands }}
      />
    </div>
  )
}
