import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox, Form } from 'antd'

import { CustomerFreeTax } from '@/api/customer/info'
import SModal from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'
import TaxTable from '@/pages/mange/customer/info/tax-table'

export interface TaxModalProps {
  openInfo: UseOpenType<CustomerFreeTax>
  onFresh: () => void
}

export default function TaxModal (props: TaxModalProps) {
  const { openInfo, onFresh } = props
  const { t } = useTranslation('customers', { keyPrefix: 'info' })
  const [form] = Form.useForm()

  useEffect(() => {
    if (!openInfo.open) return
    form.setFieldsValue(openInfo.data)
  }, [openInfo.open])

  return (
    <SModal
      title={t('设置免税地区')}
      open={openInfo.open}
      onCancel={openInfo.close}
      width={600}
    >
      <Form form={form} style={{ padding: 16, height: 500, overflowY: 'auto', overflowX: 'hidden' }}>
        <Form.Item
          name={'free'}
          extra={t('在为该客户创建订单或者客户在结账时，若销往指定地区，将不会收取税费。')}
          valuePropName={'checked'}
        >
          <Checkbox>
            {t('免税')}
          </Checkbox>
        </Form.Item>

        <div className={'line'} />

        <Form.Item style={{ marginBottom: 12 }} name={'all'}>
          <Checkbox>
            {t('对所有地区免税')}
          </Checkbox>
        </Form.Item>

        <Form.Item name={'areas'}>
          <TaxTable />
        </Form.Item>
      </Form>
    </SModal>
  )
}
