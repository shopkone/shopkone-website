import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Checkbox, Form } from 'antd'

import { CustomerFreeTax } from '@/api/customer/info'
import { CustomerSetTaxApi } from '@/api/customer/update-tax'
import { sMessage } from '@/components/s-message'
import SModal from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'
import TaxTable from '@/pages/mange/customer/info/tax-table'

export interface TaxModalProps {
  openInfo: UseOpenType<CustomerFreeTax>
  onFresh: () => void
  customerId: number
}

export default function TaxModal (props: TaxModalProps) {
  const { openInfo, onFresh, customerId } = props
  const { t } = useTranslation('customers', { keyPrefix: 'info' })
  const [form] = Form.useForm()
  const ref = useRef<HTMLDivElement>(null)
  const free = Form.useWatch('free', form)
  const update = useRequest(CustomerSetTaxApi, { manual: true })

  const onAddItem = () => {
    ref?.current?.scrollTo({ top: 100000, behavior: 'smooth' })
  }

  const onOk = async () => {
    const values = await form.validateFields()
    await update.runAsync({ id: customerId, ...values })
    onFresh()
    openInfo.close()
    sMessage.success(t('更新成功'))
  }

  useEffect(() => {
    if (!openInfo.open) return
    form.setFieldsValue(openInfo.data)
  }, [openInfo.open])

  return (
    <SModal
      onOk={onOk}
      confirmLoading={update.loading}
      title={t('设置免税地区')}
      open={openInfo.open}
      onCancel={openInfo.close}
      width={650}
    >
      <div ref={ref} style={{ padding: 16, height: 500, overflowY: 'auto', overflowX: 'hidden' }}>
        <Form form={form}>
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

          <Form.Item
            valuePropName={'checked'}
            style={{ marginBottom: 12, display: !free ? 'none' : undefined }}
            name={'all'}
          >
            <Checkbox >
              {t('对所有地区免税')}
            </Checkbox>
          </Form.Item>

          <Form.Item name={'areas'}>
            <TaxTable onAdd={onAddItem} />
          </Form.Item>
        </Form>
      </div>
    </SModal>
  )
}
