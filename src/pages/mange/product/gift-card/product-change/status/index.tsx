import { Card, Form } from 'antd'
import dayjs from 'dayjs'

import SDatePicker from '@/components/s-date-picker'
import SSelect from '@/components/s-select'
import { useVariantStatusOptions, VariantStatus } from '@/constant/product'

import styles from './index.module.less'

export default function Status () {
  const form = Form.useFormInstance()

  const statusOptions = useVariantStatusOptions()

  const status: VariantStatus = Form.useWatch('status', form)

  return (
    <Card style={{ height: status === VariantStatus.Draft ? 170 : 100 }} className={styles.container}>
      <Form.Item name={'status'} label={'Status'}>
        <SSelect options={statusOptions} style={{ width: '100%' }} />
      </Form.Item>

      {
        status === VariantStatus.Draft && (
          <Form.Item
            className={'mb0'}
            tooltip={'After setting, the product will be published on schedule according to the set time'}
            label={'Schedule availability'}
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
