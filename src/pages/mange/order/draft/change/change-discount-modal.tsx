import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Form, Input } from 'antd'

import { DiscountType } from '@/api/order/create-order'
import SInputNumber from '@/components/s-input-number'
import SModal from '@/components/s-modal'
import SSelect from '@/components/s-select'
import { UseOpenType } from '@/hooks/useOpen'

export interface ChangeDiscountData {
  discount?: { type: DiscountType, value: number, note?: string }
  variant_id: number
}

export interface ChangeDiscountModalProps {
  openInfo: UseOpenType<ChangeDiscountData>
  onConfirm: (data: ChangeDiscountData) => void
}

export default function ChangeDiscountModal (props: ChangeDiscountModalProps) {
  const { openInfo } = props
  const { t } = useTranslation('orders', { keyPrefix: 'drafts' })
  const [form] = Form.useForm()
  const type = Form.useWatch('type', form)
  const value = Form.useWatch('value', form)

  const options = [
    { label: t('百分比折扣'), value: DiscountType.Ratio },
    { label: t('固定折扣'), value: DiscountType.Fixed }
  ]

  const onOK = () => {
    const values = form.getFieldsValue()
    openInfo.close()
    props.onConfirm({
      discount: {
        type: values.type,
        value: values.value,
        note: values.note
      },
      variant_id: openInfo.data?.variant_id || 0
    })
  }

  const onRemoveDiscount = () => {
    openInfo.close()
    props.onConfirm({
      variant_id: openInfo.data?.variant_id || 0
    })
  }

  useEffect(() => {
    if (!openInfo.open) return
    form.setFieldsValue({
      type: openInfo.data?.discount?.type || DiscountType.Fixed,
      value: openInfo.data?.discount?.value,
      note: openInfo.data?.discount?.note
    })
  }, [openInfo.open])

  return (
    <SModal
      okButtonProps={{ disabled: !value }}
      onOk={onOK}
      onCancel={openInfo.close}
      title={t('设置折扣')}
      open={openInfo.open}
      extra={
          openInfo.data?.discount?.value && openInfo.data?.discount?.type
            ? (
              <Button onClick={onRemoveDiscount} danger>
                {t('移除折扣')}
              </Button>
              )
            : undefined
      }
    >
      <Form form={form} layout={'vertical'} style={{ padding: 20 }}>
        <Flex gap={16}>
          <Form.Item name={'type'} className={'flex1'} label={t('折扣类型')}>
            <SSelect options={options} />
          </Form.Item>
          <Form.Item
            required={false}
            rules={[{ required: true, message: t('请输入折扣额度') }]}
            name={'value'}
            className={'flex1'} label={t('折扣额度')}
          >
            <SInputNumber money={type === DiscountType.Fixed} suffix={type === DiscountType.Fixed ? undefined : '%'} />
          </Form.Item>
        </Flex>
        <Form.Item name={'note'} label={t('折扣说明')}>
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 7 }} />
        </Form.Item>
      </Form>
    </SModal>
  )
}
