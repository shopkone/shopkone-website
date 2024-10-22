import { ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Form, Typography } from 'antd'

import { LocationListApi } from '@/api/location/list'
import SSelect from '@/components/s-select'
import styles from '@/pages/mange/product/purchase/change/index.module.less'

export interface DestinationProps {
  value?: number
  onChange?: (value?: number) => void
  onValuesChange: () => void
  infoMode: ReactNode
}

export default function Destination (props: DestinationProps) {
  const { value, onChange, onValuesChange, infoMode } = props
  const locations = useRequest(async () => await LocationListApi({ active: true }))
  const { id } = useParams()
  const form = Form.useFormInstance()
  const { t } = useTranslation('product')

  useEffect(() => {
    if (id) return
    if (!locations.data || form.getFieldValue('destination_id')) return
    form.setFieldsValue({ destination_id: locations.data[0].id })
    onValuesChange()
  }, [locations.data])

  const find = locations.data?.find(item => item.id === value)
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
        options={locations.data?.map(item => ({ value: item.id, label: item.name }))}
        placeholder={t('选择地点')}
        className={styles.select}
        variant={'borderless'}
        dropdownStyle={{ minWidth: 300 }}
        loading={locations.loading}
      />
    </div>
  )
}
