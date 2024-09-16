import { DoubleLeft, DoubleRight, Left, Right } from '@icon-park/react'
import { Card, DatePicker, Form } from 'antd'
import dayjs from 'dayjs'

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
            tooltip={'After setting, the product will be published on schedule according to the set time'}
            label={'Schedule availability'}
          >
            <DatePicker
              inputReadOnly
              prevIcon={<Left style={{ fontSize: 16 }} />}
              nextIcon={<Right style={{ fontSize: 16 }} />}
              superPrevIcon={<DoubleLeft style={{ fontSize: 16 }} />}
              superNextIcon={<DoubleRight style={{ fontSize: 16 }} />}
              hideDisabledOptions
              minuteStep={30}
              allowClear={false}
              suffixIcon={false}
              minDate={dayjs()}
              showTime={{ format: 'HH:mm' }}
              showSecond={false}
              className={'fit-width'}
            />
          </Form.Item>
        )
      }
    </Card>
  )
}
