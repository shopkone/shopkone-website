import { useTranslation } from 'react-i18next'
import { Form } from 'antd'
import dayjs from 'dayjs'
import SCard from '@/components/s-card'

import SDatePicker from '@/components/s-date-picker'
import SSelect from '@/components/s-select'
import { useVariantStatusOptions, VariantStatus } from '@/constant/product'

import styles from './index.module.less'

export default function Status () {
  const form = Form.useFormInstance()

  const { t } = useTranslation('product')

  const statusOptions = useVariantStatusOptions(t)

  const status: VariantStatus = Form.useWatch('status', form)

  return (
    <SCard  style={{ height: status === VariantStatus.Draft ? 170 : 100 }} className={styles.container}>
      <Form.Item name={'status'} label={t('状态')}>
        <SSelect options={statusOptions} style={{ width: '100%' }} />
      </Form.Item>

      {
        status === VariantStatus.Draft && (
          <Form.Item
            className={'mb0'}
            tooltip={t('设置后，产品将根据设定时间按计划发布')}
            label={t('计划可用性')}
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
    </SCard>
  )
}
