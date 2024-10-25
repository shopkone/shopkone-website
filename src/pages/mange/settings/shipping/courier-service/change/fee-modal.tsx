import { useTranslation } from 'react-i18next'
import { Checkbox, Flex, Form, Input, Radio } from 'antd'

import { useCurrencyList } from '@/api/base/currency-list'
import { ShippingZoneFeeMatchRule, ShippingZoneFeeType } from '@/api/shipping/base'
import SModal from '@/components/s-modal'
import SSelect from '@/components/s-select'
import { WEIGHT_UNIT_OPTIONS } from '@/constant/product'
import FeeCondition from '@/pages/mange/settings/shipping/courier-service/change/fee-condition'

export default function FeeModal () {
  const [form] = Form.useForm()
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const currency = useCurrencyList()

  const options = [
    { label: t('按订单总价'), value: ShippingZoneFeeMatchRule.OrderPrice },
    { label: t('按商品总价'), value: ShippingZoneFeeMatchRule.ProductPrice },
    { label: t('按商品件数'), value: ShippingZoneFeeMatchRule.ProductCount },
    { label: t('按包裹重量'), value: ShippingZoneFeeMatchRule.OrderWeight }
  ]

  const feeTypeOptions = [
    { label: t('固定运费'), value: ShippingZoneFeeType.Fixed },
    { label: t('首重 + 续重'), value: ShippingZoneFeeType.Weight },
    { label: t('首件 + 续件'), value: ShippingZoneFeeType.Count }
  ]

  return (
    <SModal width={1000} >
      <Form form={form} style={{ height: 600, padding: 16, overflowY: 'auto' }} layout={'vertical'}>
        <Form.Item label={t('运费名称（客户选择物流方案时展示）')}>
          <Input style={{ maxWidth: 600 }} placeholder={t('请填写运费名称')} />
        </Form.Item>
        <Form.Item label={t('补充说明')}>
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
            <Form.Item name={'type'} className={'mb0 flex1'} style={{ width: 150 }}>
              <SSelect options={feeTypeOptions} />
            </Form.Item>
            <Form.Item
              name={'weight_uint'}
              className={'mb0'}
              style={{
                width: 141,
                marginLeft: 16
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

        <Form.Item>
          <Checkbox>
            {t('设置使用条件')}
          </Checkbox>
        </Form.Item>

        <Flex align={'center'} style={{ marginBottom: 16 }}>
          {t('条件区间：')}
          <Form.Item name={'match_rule'} className={'mb0'}>
            <Radio.Group options={options} />
          </Form.Item>
        </Flex>

        <Form.Item>
          <FeeCondition />
        </Form.Item>
      </Form>
    </SModal>
  )
}
