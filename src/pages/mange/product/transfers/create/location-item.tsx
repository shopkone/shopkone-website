import { ReactNode } from 'react'
import { Typography } from 'antd'

import { LocationListRes } from '@/api/location/list'
import SSelect from '@/components/s-select'
import styles from '@/pages/mange/product/purchase/change/index.module.less'

export interface LocationItemProps {
  value?: number
  onChange?: (value?: number) => void
  onValuesChange: () => void
  infoMode: ReactNode
  locations?: LocationListRes[]
  placeHolder?: ReactNode
  disabledId?: number
}

export default function LocationItem (props: LocationItemProps) {
  const { value, onChange, onValuesChange, infoMode, locations, placeHolder, disabledId } = props

  const find = locations?.find(item => item.id === value)
  if (infoMode) {
    return (
      <Typography.Text>
        {find?.name}
      </Typography.Text>
    )
  }

  return (
    <div style={{ maxWidth: 433 }}>
      <SSelect
        value={value}
        onChange={onChange}
        options={locations?.map(item => ({ value: item.id, label: item.name, disabled: item.id === disabledId && (locations?.length || 0) > 3 }))}
        placeholder={placeHolder}
        className={styles.select}
        variant={'borderless'}
        dropdownStyle={{ minWidth: 300 }}
      />
    </div>
  )
}
