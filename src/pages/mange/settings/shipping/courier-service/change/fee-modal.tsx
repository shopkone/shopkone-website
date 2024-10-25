import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox, Flex, Form, Input, Radio } from 'antd'

import { useCurrencyList } from '@/api/base/currency-list'
import { BaseShippingZoneFee, ShippingZoneFeeRule, ShippingZoneFeeType } from '@/api/shipping/base'
import SModal from '@/components/s-modal'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import { WEIGHT_UNIT_OPTIONS } from '@/constant/product'
import { UseOpenType } from '@/hooks/useOpen'
import FeeCondition from '@/pages/mange/settings/shipping/courier-service/change/fee-condition'
import { genId } from '@/utils/random'

export interface FeeModalProps {
  openInfo: UseOpenType<{ fee?: BaseShippingZoneFee, zoneId: number }>
  onConfirm: (value: { fee?: BaseShippingZoneFee, zoneId: number }) => void
}

export default function FeeModal (props: FeeModalProps) {
  const { openInfo, onConfirm } = props
  const [form] = Form.useForm()
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const currency = useCurrencyList()

  const rule = Form.useWatch('rule', form)
  const type: ShippingZoneFeeType = Form.useWatch('type', form)

  const options = [
    { label: t('按订单总价'), value: ShippingZoneFeeRule.OrderPrice },
    { label: t('按商品总价'), value: ShippingZoneFeeRule.ProductPrice },
    { label: t('按商品件数'), value: ShippingZoneFeeRule.ProductCount },
    { label: t('按包裹重量'), value: ShippingZoneFeeRule.OrderWeight }
  ]

  const feeTypeOptions = [
    { label: t('固定运费'), value: ShippingZoneFeeType.Fixed },
    { label: t('首重 + 续重'), value: ShippingZoneFeeType.Weight },
    { label: t('首件 + 续件'), value: ShippingZoneFeeType.Count }
  ]

  const onSetCondition = (is: boolean) => {
    if (is) {
      form.setFieldValue('rule', ShippingZoneFeeRule.OrderPrice)
    } else {
      form.setFieldValue('conditions', [form.getFieldValue('conditions')[0]])
      form.setFieldValue('rule', undefined)
    }
  }

  const onOk = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    onConfirm({ fee: values, zoneId: openInfo.data?.zoneId || 0 })
    openInfo.close()
  }

  useEffect(() => {
    if (!openInfo.open) return
    if (openInfo.data) {
      form.setFieldsValue(openInfo.data?.fee)
    } else {
      const item: BaseShippingZoneFee = {
        id: genId(),
        name: '',
        note: '',
        weight_unit: 'kg',
        type: ShippingZoneFeeType.Fixed,
        currency_code: 'USD',
        conditions: [
          { id: genId(), fixed: 0, first: 0, first_fee: 0, max: 0, min: 0, next: 0, next_fee: 0 }
        ]
      }
      form.setFieldsValue(item)
    }
  }, [openInfo.open])

  return (
    <SModal onOk={onOk} title={openInfo?.data?.fee ? t('编辑运费') : t('添加运费')} onCancel={openInfo.close} open={openInfo.open} width={1000} >
      <Form id={'form_id_scroll_handle_to_bottom'} form={form} style={{ height: 600, overflowY: 'auto', padding: '0 16px 32px 16px' }} layout={'vertical'}>
        <Form.Item required={false} name={'name'} rules={[{ required: true, message: t('请填写运费名称') }]} style={{ paddingTop: 16 }} label={t('运费名称（客户选择物流方案时展示）')}>
          <Input autoComplete={'off'} style={{ maxWidth: 600 }} placeholder={t('请填写运费名称')} />
        </Form.Item>
        <Form.Item name={'remarks'} label={t('补充说明')}>
          <Input.TextArea
            style={{ maxWidth: 600 }}
            autoSize={{ minRows: 4, maxRows: 4 }}
            placeholder={t('补充说明物流时效，送货注意事项等信息（可选，如有填写，将在无运费合并时进行展示）')}
          />
        </Form.Item>
        <Form.Item>
          <Checkbox>{t('支持货到付款')}</Checkbox>
        </Form.Item>
        <Flex
          align={'center'}
          style={{
            marginBottom: 16,
            width: 400
          }}
        >
          <div style={{ flexShrink: 0 }}>{t('计费方式：')}</div>
          <Flex flex={1}>
            <Form.Item name={'type'} className={'mb0 flex1'}>
              <SSelect options={feeTypeOptions} />
            </Form.Item>
            <Form.Item
              name={'weight_unit'}
              className={'mb0'}
              style={{
                width: 141,
                marginLeft: 16,
                display: type === ShippingZoneFeeType.Weight ? undefined : 'none'
              }}
            >
              <SSelect options={WEIGHT_UNIT_OPTIONS} />
            </Form.Item>
          </Flex>
        </Flex>

        <Flex
          align={'center'} style={{
            marginBottom: 16,
            width: 400
          }}
        >
          <div style={{ flexShrink: 0 }}>{t('计费货币：')}</div>
          <Form.Item name={'currency_code'} className={'mb0 fit-width'}>
            <SSelect
              showSearch
              optionFilterProp={'title'}
              fieldNames={{ value: 'code', label: 'title' }}
              options={currency.data}
              dropdownStyle={{ width: 350 }}
            />
          </Form.Item>
        </Flex>

        <SRender render={rule}>
          <Checkbox
            checked={rule}
            onChange={e => { onSetCondition(e.target.checked) }}
            style={{ marginBottom: 16 }}
          >
            {t('设置使用条件')}
          </Checkbox>
        </SRender>

        <Flex align={'center'} style={{ marginBottom: 16, display: rule ? 'flex' : 'none' }}>
          {t('条件区间：')}
          <Form.Item name={'rule'} className={'mb0'}>
            <Radio.Group options={options} />
          </Form.Item>
        </Flex>

        <Form.Item name={'conditions'}>
          <FeeCondition />
        </Form.Item>

        <SRender render={!rule}>
          <Checkbox
            checked={rule}
            onChange={e => { onSetCondition(e.target.checked) }}
            style={{ marginBottom: 16 }}
          >
            {t('设置使用条件')}
          </Checkbox>
        </SRender>
      </Form>
    </SModal>
  )
}
