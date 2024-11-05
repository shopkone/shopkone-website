import { useTranslation } from 'react-i18next'
import { Form, FormInstance, Input } from 'antd'

import SelectCountry from '@/components/select-country'
import styles from '@/pages/mange/settings/markets/change/index.module.less'

export interface MarketsEditProps {
  noClassName?: boolean
  height?: number
  form: FormInstance
}

export default function MarketsEdit (props: MarketsEditProps) {
  const { noClassName, height: h, form } = props
  const { t } = useTranslation('settings', { keyPrefix: 'market' })

  const height = h || window.innerHeight - 370

  return (
    <Form form={form} className={noClassName ? '' : styles.form} layout={'vertical'}>
      <Form.Item label={t('市场名称')}>
        <Input autoComplete={'off'} />
      </Form.Item>

      <Form.Item name={'country_codes'} label={t('选择市场包含的国家/地区')}>
        <SelectCountry height={height} onlyCountry />
      </Form.Item>
    </Form>
  )
}
