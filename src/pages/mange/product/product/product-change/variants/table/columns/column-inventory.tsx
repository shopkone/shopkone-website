import { useMemo } from 'react'
import { Tooltip } from 'antd'

import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'
import { genId } from '@/utils/random'

export interface ColumnInventoryProps {
  row: Variant
  locationId: number
  value: Variant['inventories']
  onChange: (value: Variant['inventories']) => void
}

export default function ColumnInventory (props: ColumnInventoryProps) {
  const { row, onChange, value, locationId } = props

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
      <SRender render={row?.children?.length}>
        <Tooltip title={'Update for individual variants only'}>
          <SInputNumber value={total} variant={'filled'} disabled style={{ border: 'none', cursor: 'default' }} />
        </Tooltip>
      </SRender>
      <SRender render={!row?.children?.length}>
        <SRender render={locationId}>
          <SInputNumber
            value={row?.inventories?.find(item => item.location_id === locationId)?.quantity || 0}
            onChange={v => { onChangeHandle(v || null) }} uint
          />
        </SRender>

        <SRender render={!locationId}>
          <Tooltip title={'Choose where you want to edit'}>
            <SInputNumber value={total} variant={'filled'} disabled style={{ border: 'none', cursor: 'default' }} />
          </Tooltip>
        </SRender>
      </SRender>
    </div>
  )
}
