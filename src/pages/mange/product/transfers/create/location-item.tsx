import { ReactNode, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Form, Typography } from 'antd'

import { LocationListRes } from '@/api/location/list'
import SSelect from '@/components/s-select'
import { useI18n } from '@/hooks/use-lang'
import styles from '@/pages/mange/product/purchase/change/index.module.less'

export interface LocationItemProps {
  value?: number
  onChange?: (value?: number) => void
  onValuesChange: () => void
  infoMode: ReactNode
  locations?: LocationListRes[]
}

export default function LocationItem (props: LocationItemProps) {
  const { value, onChange, onValuesChange, infoMode, locations } = props
  const { id } = useParams()
  const form = Form.useFormInstance()
  const t = useI18n()

  useEffect(() => {
    if (id) return
    if (!locations || form.getFieldValue('destination_id')) return
    form.setFieldsValue({ destination_id: locations[0].id })
    onValuesChange()
  }, [locations])

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
        options={locations?.map(item => ({ value: item.id, label: item.name }))}
        placeholder={t('选择地点')}
        className={styles.select}
        variant={'borderless'}
        dropdownStyle={{ minWidth: 300 }}
      />
    </div>
  )
}
