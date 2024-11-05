import { useTranslation } from 'react-i18next'
import { Form, FormInstance, Input } from 'antd'

import { MarketInfoRes } from '@/api/market/info'
import SelectCountry from '@/components/select-country'
import styles from '@/pages/mange/settings/markets/change/index.module.less'

export interface MarketsEditProps {
  noClassName?: boolean
  height?: number
  form: FormInstance
  onValuesChange?: (values: any) => void
  data?: MarketInfoRes
}

export default function MarketsEdit (props: MarketsEditProps) {
  const { noClassName, height: h, form, onValuesChange, data } = props
  const { t } = useTranslation('settings', { keyPrefix: 'market' })

  const height = h || window.innerHeight - 370

  return (
    <Form onValuesChange={onValuesChange} form={form} className={noClassName ? '' : styles.form} layout={'vertical'}>
      <Form.Item
        name={'name'}
        required={false}
        rules={[{ required: true, message: t('请输入市场名称') }]}
        label={t('市场名称')}
        style={{ display: data?.is_main ? 'none' : undefined }}
      >
        <Input autoComplete={'off'} />
      </Form.Item>

      <Form.Item
        required={false}
        rules={[{ required: true, message: t('请选择国家/地区') }]}
        name={'country_codes'} label={t('选择市场包含的国家/地区')}
      >
        <SelectCountry height={height} onlyCountry />
      </Form.Item>
    </Form>
  )
}
