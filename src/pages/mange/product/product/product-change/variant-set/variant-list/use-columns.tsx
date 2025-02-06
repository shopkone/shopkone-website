import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from 'antd'

import { useCurrencyList } from '@/api/base/currency-list'
import SInputNumber from '@/components/s-input-number'
import { STableProps } from '@/components/s-table'
import { Variant, VariantName } from '@/pages/mange/product/product/product-change/variant-set/state'
import { useManageState } from '@/pages/mange/state'

export interface UseColumnsProps {
  onChange?: (variants: Variant[]) => void
  value: Variant[]
}

export function UseColumns (props: UseColumnsProps) {
  const { onChange, value } = props
  const { t } = useTranslation('product', { keyPrefix: 'product' })

  const shopInfo = useManageState(state => state.shopInfo)
  const currencies = useCurrencyList()
  const currency = currencies?.data?.find(item => item.code === shopInfo?.store_currency)

  const onChangePrice = (id: number, price: number) => {
    const newValue = value.map(item => {
      return item.id === id ? { ...item, price } : item
    })
    onChange?.(newValue)
  }

  const columns: STableProps['columns'] = useMemo(() => [
    {
      title: t('款式'),
      name: 'name',
      code: 'name',
      width: 230,
      lock: true,
      render: (names: VariantName[], row) => {
        return names.map((name) => name.value).join(' - ')
      }
    },
    {
      title: t('售价'),
      name: 'price',
      code: 'price',
      width: 140,
      render: (price: number, row: Variant) => (
        <SInputNumber
          onChange={(price) => { onChangePrice(row.id, price || 0) }}
          value={price}
          money
          prefix={`${currency?.code}${currency?.symbol}`}
        />
      )
    },
    {
      title: t('库存'),
      name: 'inventory',
      code: 'inventory',
      width: 100,
      render: () => (
        <div style={{ marginRight: 8 }}>
          <Input />
        </div>
      )
    }
  ], [t, currency, value])

  return columns
}
