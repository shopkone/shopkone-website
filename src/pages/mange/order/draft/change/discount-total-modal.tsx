import { useTranslation } from 'react-i18next'
import { Form, Input } from 'antd'

import SInputNumber from '@/components/s-input-number'
import SModal from '@/components/s-modal'
import { UseOpenType } from '@/hooks/useOpen'
import { roundPrice } from '@/utils/num'

export interface DiscountTotalModalType {
  discount?: number
  discount_note?: string
}

export interface DiscountTotalModalProps {
  openInfo: UseOpenType<DiscountTotalModalType>
  onChange?: (value: DiscountTotalModalType) => void
  value?: DiscountTotalModalType
  price: number
}

export default function DiscountTotalModal (props: DiscountTotalModalProps) {
  const { openInfo, onChange, value, price = 0 } = props
  const { t } = useTranslation('orders', { keyPrefix: 'drafts' })

  const [form] = Form.useForm()
  const discount = Form.useWatch('discount', form)

  const onOk = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    openInfo.close()
    onChange?.({
      discount: values.discount,
      discount_note: values.discount_note
    })
  }

  return (
    <div>
      {roundPrice(value?.discount || 0)}
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
                    return await Promise.reject(t('折扣金额不能大于商品金额'))
                  } else {
                    await Promise.resolve()
                  }
                }
              }
            ]}
            name={'discount'} label={t('折扣金额')}
          >
            <SInputNumber money required />
          </Form.Item>
          <Form.Item name={'discount_note'} label={t('折扣说明')}>
            <Input.TextArea autoSize={{ minRows: 3 }} />
          </Form.Item>
        </Form>
      </SModal>
    </div>
  )
}
