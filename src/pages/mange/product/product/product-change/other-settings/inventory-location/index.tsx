import { useEffect, useMemo } from 'react'
import { useRequest } from 'ahooks'
import { Checkbox, Form } from 'antd'

import { LocationListApi } from '@/api/location/list'
import SLoading from '@/components/s-loading'

import styles from '../index.module.less'

export default function InventoryLocation () {
  const form = Form.useFormInstance()
  const enabled_location_ids = Form.useWatch('enabled_location_ids', form)

  const location = useRequest(
    async () => await LocationListApi({ active: true })
  )

  const options = useMemo(() => {
    return location.data?.map(item => {
      return { label: item.name, value: item.id, disabled: enabled_location_ids?.length === 1 && enabled_location_ids[0] === item.id }
    })
  }, [location.data, enabled_location_ids])

  useEffect(() => {
    if (!location.data) return
    if (enabled_location_ids?.length) return
    form.setFieldValue('enabled_location_ids', location.data.map(item => item.id))
  }, [location.data, enabled_location_ids])

  return (
    <SLoading loading={location.loading}>
      <div className={styles.inner}>
        <Form.Item className={'mb0'} name={'enabled_location_ids'}>
          <Checkbox.Group options={options} />
        </Form.Item>
      </div>
    </SLoading>
  )
}
