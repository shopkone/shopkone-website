import { Card, Form } from 'antd'
import dayjs from 'dayjs'

import SDatePicker from '@/components/s-date-picker'
import SSelect from '@/components/s-select'
import { useVariantStatusOptions, VariantStatus } from '@/constant/product'
import { useI18n } from '@/hooks/use-lang'

import styles from './index.module.less'

export default function Status () {
  const form = Form.useFormInstance()

  const t = useI18n()
  const statusOptions = useVariantStatusOptions(t)

  const status: VariantStatus = Form.useWatch('status', form)

  return (
    <Card style={{ height: status === VariantStatus.Draft ? 170 : 100 }} className={styles.container}>
      <Form.Item name={'status'} label={t('状态')}>
        <SSelect options={statusOptions} style={{ width: '100%' }} />
      </Form.Item>

      {
        status === VariantStatus.Draft && (
          <Form.Item
            name={'scheduled_at'}
            tooltip={t('设置指定上架时间后，商品将按照设置的时间如期发布')}
            label={t('自动上架时间')}
          >
            <SDatePicker
              hideDisabledOptions
              minuteStep={30}
              allowClear={false}
              suffixIcon={false}
              minDate={dayjs()}
              showTime={{ format: 'HH:mm' }}
              showSecond={false}
            />
          </Form.Item>
        )
      }
    </Card>
  )
}
