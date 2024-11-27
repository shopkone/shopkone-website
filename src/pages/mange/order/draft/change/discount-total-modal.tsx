import { useTranslation } from 'react-i18next'
import { Form, Input } from 'antd'

import { useCurrencyList } from '@/api/base/currency-list'
import { OrderDiscountType, OrderPreBaseDiscount } from '@/api/order/pre-cal-order'
import SInputNumber from '@/components/s-input-number'
import SModal from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'
import { useManageState } from '@/pages/mange/state'
import { roundPrice } from '@/utils/num'

export interface DiscountTotalModalProps {
  openInfo: UseOpenType<OrderPreBaseDiscount>
  onChange?: (value: OrderPreBaseDiscount) => void
  value?: OrderPreBaseDiscount
  price: number
}

export default function DiscountTotalModal (props: DiscountTotalModalProps) {
  const { openInfo, onChange, value, price = 0 } = props
  const { t } = useTranslation('orders', { keyPrefix: 'drafts' })
  const storeCurrency = useManageState(state => state.shopInfo?.store_currency)
  const currencyList = useCurrencyList()

  const [form] = Form.useForm()
  const discount = Form.useWatch('price', form)

  const onOk = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    openInfo.close()
    onChange?.({
      price: values.price,
      type: OrderDiscountType.Fixed,
      id: 0,
      note: values?.note
    })
  }

  return (
    <div>
      {roundPrice(value?.price || 0)}
      <SModal
        onOk={onOk}
        title={t('设置折扣')}
        open={openInfo.open}
        onCancel={openInfo.close}
        okButtonProps={{ disabled: !discount }}
      >
        <Form form={form} style={{ padding: 16 }} layout={'vertical'}>
          <Form.Item
            rules={[
              {
                validator: async (_, value) => {
                  if (value > price) {
                    return await Promise.reject(t('折扣金额不能大于商品金额', { x: `${currencyList?.data?.find(i => i.code === storeCurrency)?.symbol}${price}` }))
                  } else {
                    await Promise.resolve()
                  }
                }
              }
            ]}
            name={'price'} label={t('折扣金额')}
          >
            <SInputNumber money required />
          </Form.Item>
          <Form.Item name={'note'} label={t('折扣说明')}>
            <Input.TextArea autoSize={{ minRows: 3 }} />
          </Form.Item>
        </Form>
      </SModal>
    </div>
  )
}
