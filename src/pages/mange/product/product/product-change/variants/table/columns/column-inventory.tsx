import { useMemo } from 'react'
import { IconChevronDown } from '@tabler/icons-react'
import { Flex } from 'antd'

import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'
import { genId } from '@/utils/random'

import styles from './index.module.less'

export interface ColumnInventoryProps {
  row: Variant
  locationId: number
  value: Variant['inventories']
  onChange: (value: Variant['inventories']) => void
  expands: number[]
  setExpands: (expands: number[]) => void
}

export default function ColumnInventory (props: ColumnInventoryProps) {
  const { row, onChange, value, locationId, expands, setExpands } = props

  const setExpandsHandle = () => {
    if (expands.includes(row.id)) {
      setExpands(expands.filter(id => id !== row.id))
    } else {
      setExpands([...expands, row.id])
    }
  }

  const onChangeHandle = (v: number | null) => {
    if (!locationId) return
    let inventories = value
    if (!inventories?.length) {
      inventories = []
    }
    if (!inventories.find(item => item.location_id === locationId)) {
      inventories.push({ id: genId(), location_id: locationId, quantity: v })
    }
    inventories = inventories.map(item => {
      if (item.location_id === locationId) {
        return { ...item, quantity: v }
      }
      return item
    })
    onChange(inventories)
  }

  const total = useMemo(() => {
    const items: Variant['inventories'] = []
    if (row.children?.length) {
      row.children.forEach(child => {
        child?.inventories?.forEach(inventory => {
          if (!locationId || inventory.location_id === locationId) {
            items.push(inventory)
          }
        })
      })
    } else {
      row?.inventories?.forEach(inventory => {
        if (!locationId || inventory.location_id === locationId) {
          items.push(inventory)
        }
      })
    }
    return items?.reduce((acc, cur) => acc + (cur.quantity || 0), 0)
  }, [row, locationId])

  return (
    <div>
      <SRender onClick={setExpandsHandle} render={row?.children?.length}>
        <Flex className={styles.link} align={'center'} gap={4}>
          <div>{total}</div>
          <IconChevronDown
            className={styles.downIcon}
            style={{ transform: expands?.includes(row.id) ? 'rotate(-180deg)' : 'rotate(0deg)' }}
            size={13}
          />
        </Flex>
      </SRender>
      <SRender render={!row?.children?.length}>
        <SRender render={locationId}>
          <SInputNumber
            value={row?.inventories?.find(item => item.location_id === locationId)?.quantity || undefined}
            onChange={onChangeHandle} uint
          />
        </SRender>
        <SRender render={!locationId}>
          {total}
        </SRender>
      </SRender>
    </div>
  )
}
