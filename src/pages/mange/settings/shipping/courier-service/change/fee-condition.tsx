import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Form } from 'antd'

import { useCurrencyList } from '@/api/base/currency-list'
import { ShippingZoneFeeMatchRule, ShippingZoneFeeType } from '@/api/shipping/base'
import SInputNumber from '@/components/s-input-number'
import STable, { STableProps } from '@/components/s-table'

export default function FeeCondition () {
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const currencyList = useCurrencyList()
  const form = Form.useFormInstance()
  const match_rule: ShippingZoneFeeMatchRule = Form.useWatch('match_rule', form)
  const type: ShippingZoneFeeType = Form.useWatch('type', form)
  const currency_code = Form.useWatch('currency_code', form)
  const weight_uint = Form.useWatch('weight_uint', form)
  const currency = currencyList?.data?.find(item => item.code === currency_code)

  const options = [
    { label: t('按订单总价'), value: ShippingZoneFeeMatchRule.OrderPrice },
    { label: t('按商品总价'), value: ShippingZoneFeeMatchRule.ProductPrice },
    { label: t('按商品件数'), value: ShippingZoneFeeMatchRule.ProductCount },
    { label: t('按包裹重量'), value: ShippingZoneFeeMatchRule.OrderWeight }
  ]

  const isCount = type === ShippingZoneFeeType.Count

  const isPriceRange = match_rule === ShippingZoneFeeMatchRule.OrderPrice || match_rule === ShippingZoneFeeMatchRule.ProductPrice
  const isCountRange = match_rule === ShippingZoneFeeMatchRule.ProductCount

  const rangeSuffix = useMemo(() => {
    if (match_rule === ShippingZoneFeeMatchRule.ProductCount) {
      return t('件')
    }
    if (match_rule === ShippingZoneFeeMatchRule.OrderWeight) {
      return weight_uint
    }
  }, [match_rule])

  const columns: STableProps['columns'] = [
    {
      title: options.find(item => item.value === match_rule)?.label,
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
      width: 250
    },
    {
      title: t('运费'),
      code: 'fixed',
      name: 'fixed',
      render: () => (
        <SInputNumber />
      ),
      width: 150,
      hidden: type !== ShippingZoneFeeType.Fixed
    },
    {
      title: isCount ? t('首件') : t('首重'),
      code: 'first_weight',
      name: 'first_weight',
      render: () => <SInputNumber suffix={isCount ? t('件') : weight_uint} />,
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
      render: () => <SInputNumber suffix={isCount ? t('件') : weight_uint} />,
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

  return (
    <div>
      <STable
        init
        borderless
        className={'table-white-header table-border'}
        data={[{ id: 123 }]}
        columns={columns}
      />
      <Button style={{ marginTop: 16 }}>{t('添加区间')}</Button>
    </div>
  )
}
