import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Form } from 'antd'

import { useCurrencyList } from '@/api/base/currency-list'
import { BaseShippingZoneFeeCondition, ShippingZoneFeeRule, ShippingZoneFeeType } from '@/api/shipping/base'
import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'

export interface FeeConditionProps {
  value?: BaseShippingZoneFeeCondition[]
  onChange?: (value: BaseShippingZoneFeeCondition[]) => void
}

export default function FeeCondition (props: FeeConditionProps) {
  const { value, onChange } = props
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const currencyList = useCurrencyList()
  const form = Form.useFormInstance()
  const rule: ShippingZoneFeeRule = Form.useWatch('rule', form)
  const type: ShippingZoneFeeType = Form.useWatch('type', form)
  const currency_code = Form.useWatch('currency_code', form)
  const weight_unit = Form.useWatch('weight_unit', form)
  const currency = currencyList?.data?.find(item => item.code === currency_code)

  const options = [
    { label: t('按订单总价'), value: ShippingZoneFeeRule.OrderPrice },
    { label: t('按商品总价'), value: ShippingZoneFeeRule.ProductPrice },
    { label: t('按商品件数'), value: ShippingZoneFeeRule.ProductCount },
    { label: t('按包裹重量'), value: ShippingZoneFeeRule.OrderWeight }
  ]

  const isCount = type === ShippingZoneFeeType.Count

  const isPriceRange = rule === ShippingZoneFeeRule.OrderPrice || rule === ShippingZoneFeeRule.ProductPrice
  const isCountRange = rule === ShippingZoneFeeRule.ProductCount

  const rangeSuffix = useMemo(() => {
    if (rule === ShippingZoneFeeRule.ProductCount) {
      return t('件')
    }
    if (rule === ShippingZoneFeeRule.OrderWeight) {
      return weight_unit
    }
  }, [rule])

  const columns: STableProps['columns'] = [
    {
      title: options.find(item => item.value === rule)?.label,
      code: 'march_rule',
      name: 'march_rule',
      render: () => {
        return (
          <Flex gap={8} align={'center'}>
            <SInputNumber
              uint={isCountRange}
              money={isPriceRange}
              prefix={isPriceRange ? currency?.symbol : undefined}
              suffix={rangeSuffix}
            />
            <div>-</div>
            <SInputNumber
              uint={isCountRange}
              money={isPriceRange}
              prefix={isPriceRange ? currency?.symbol : undefined}
              suffix={rangeSuffix}
            />
          </Flex>
        )
      },
      width: 250,
      hidden: !rule
    },
    {
      title: t('运费'),
      code: 'fixed',
      name: 'fixed',
      render: (fixed: number) => (
        <SInputNumber value={fixed} money />
      ),
      width: 150,
      hidden: type !== ShippingZoneFeeType.Fixed
    },
    {
      title: isCount ? t('首件') : t('首重'),
      code: 'first_weight',
      name: 'first_weight',
      render: () => <SInputNumber suffix={isCount ? t('件') : weight_unit} />,
      width: 150,
      hidden: type === ShippingZoneFeeType.Fixed
    },
    {
      title: isCount ? t('首件费用') : t('首重费用'),
      code: 'first_fee',
      name: 'first_fee',
      render: () => <SInputNumber money prefix={currency?.symbol} />,
      width: 150,
      hidden: type === ShippingZoneFeeType.Fixed
    },
    {
      title: isCount ? t('续件') : t('续重'),
      code: 'next_weight',
      name: 'next_weight',
      render: () => <SInputNumber suffix={isCount ? t('件') : weight_unit} />,
      width: 150,
      hidden: type === ShippingZoneFeeType.Fixed
    },
    {
      title: isCount ? t('续件费用') : t('续重费用'),
      code: 'next_fee',
      name: 'next_fee',
      render: () => <SInputNumber money prefix={currency?.symbol} />,
      width: 150,
      hidden: type === ShippingZoneFeeType.Fixed
    },
    {
      title: '',
      code: 'none',
      name: 'none',
      width: 300,
      hidden: type !== ShippingZoneFeeType.Fixed
    }
  ]

  if (value?.length === 1 && type === ShippingZoneFeeType.Fixed && !rule) {
    return (
      <Flex
        align={'center'} style={{
          marginBottom: 16,
          width: 400
        }}
      >
        <div style={{ flexShrink: 0 }}>{t('运费价格：')}</div>
        <SInputNumber value={value[0].fixed} money />
      </Flex>
    )
  }

  return (
    <div>
      <STable
        init
        borderless
        className={'table-border'}
        data={[{ id: 123 }]}
        columns={columns}
      />
      <SRender render={rule}>
        <Button style={{ marginTop: 16 }}>{t('添加区间')}</Button>
      </SRender>
    </div>
  )
}
