import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMemoizedFn } from 'ahooks'
import { Alert, Flex, Form, Input, Radio } from 'antd'

import { useCurrencyList } from '@/api/base/currency-list'
import { BasePreShippingFeePlan, OrderPreBaseShippingFee } from '@/api/order/pre-cal-order'
import SInputNumber from '@/components/s-input-number'
import SModal from '@/components/s-modal'
import SRender from '@/components/s-render'
import { UseOpenType } from '@/hooks/useOpen'
import { useManageState } from '@/pages/mange/state'

export interface ShippingFeeProps {
  openInfo: UseOpenType<OrderPreBaseShippingFee>
  plans?: BasePreShippingFeePlan[]
  value?: OrderPreBaseShippingFee
  onChange?: (value?: OrderPreBaseShippingFee) => void
}

export default function ShippingFee (props: ShippingFeeProps) {
  const { openInfo, plans, onChange } = props
  const [temp, setTemp] = useState<OrderPreBaseShippingFee>()
  const { t } = useTranslation('orders', { keyPrefix: 'drafts' })
  const storeCurrency = useManageState(state => state.shopInfo?.store_currency)
  const currencies = useCurrencyList()
  const wrapForm = Form.useFormInstance()
  const customerId = Form.useWatch('customer_id', wrapForm)

  const [form] = Form.useForm()

  const options = useMemo(() => (
    (plans?.map(item => ({
      label: `${item.name} · ${currencies?.data?.find(i => i.code === storeCurrency)?.symbol} ${item.price}`,
      value: item.id
    })) || []).concat([
      { label: t('免运费'), value: 0 },
      { label: t('自定义运费'), value: -1 }
    ])
  ), [plans])

  const onSelect = (e: number) => {
    if (e === 0) {
      setTemp({ free: true })
    } else if (e === -1) {
      setTemp({ customer: true })
    } else {
      setTemp({ shipping_fee_id: e })
    }
  }

  const isChecked = useMemoizedFn((v: number) => {
    if (v === -1 && temp?.customer) return true
    if (v === 0 && temp?.free) return true
    if (v < 1) return false
    return v === temp?.shipping_fee_id
  })

  const onOk = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    onChange?.({ ...temp, ...values })
    openInfo.close()
  }

  useEffect(() => {
    if (!openInfo.open) return
    setTemp(openInfo.data)
  }, [openInfo.open])

  useEffect(() => {
    form.setFieldsValue(temp)
  }, [temp])

  return (
    <SModal
      onOk={onOk}
      width={500}
      title={t('设置运费')}
      open={openInfo.open}
      onCancel={openInfo.close}
    >
      <div style={{ maxHeight: 500, overflow: 'auto', padding: 20 }}>
        <SRender render={!customerId}>
          <Alert
            style={{ marginBottom: 12 }}
            message={t('当填写客户收件地址后，可选择适用当地的运费方案。')}
          />
        </SRender>
        <Flex gap={12} vertical>
          {
            options?.map(opt => (
              <Radio
                onChange={e => { onSelect(e.target.value) }}
                checked={isChecked(opt.value)}
                key={opt.value}
                value={opt.value}
              >
                {opt.label}
              </Radio>
            ))
          }
          <SRender render={temp?.customer}>
            <Form form={form} style={{ marginTop: 4 }} layout={'vertical'}>
              <Form.Item
                required={false}
                rules={[{ required: true, message: t('请输入运费名称') }]}
                name={'name'} label={t('运费名称')}
              >
                <Input
                  autoComplete={'off'}
                  value={temp?.name}
                />
              </Form.Item>
              <Form.Item
                required={false}
                rules={[{ required: true, message: t('请输入运费') }]}
                name={'price'} label={t('运费')}
              >
                <SInputNumber
                  money
                  value={temp?.price}
                />
              </Form.Item>
            </Form>
          </SRender>
        </Flex>
      </div>
    </SModal>
  )
}
