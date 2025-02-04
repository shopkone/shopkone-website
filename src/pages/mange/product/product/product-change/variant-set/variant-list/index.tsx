import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconMaximize } from '@tabler/icons-react'
import { Flex, Input } from 'antd'

import { useCurrencyList } from '@/api/base/currency-list'
import IconButton from '@/components/icon-button'
import SCard from '@/components/s-card'
import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import STable, { STableProps } from '@/components/s-table'
import { OptionValue } from '@/pages/mange/product/product/product-change/variant-set/variant-options/option-item'
import * as worker from '@/pages/mange/product/product/product-change/variant-set/worker'
import { Variant, VariantName } from '@/pages/mange/product/product/product-change/variants/state'
import { useManageState } from '@/pages/mange/state'

import styles from './index.module.less'

export default function VariantList () {
  const [variants, setVariants] = useState<Variant[]>([])
  const [options, setOptions] = useState<OptionValue[]>([])
  const { t } = useTranslation('product', { keyPrefix: 'product' })
  const [selected, setSelected] = useState<number[]>([])
  const shopInfo = useManageState(state => state.shopInfo)
  const currencies = useCurrencyList()
  const currency = currencies?.data?.find(item => item.code === shopInfo?.store_currency)

  const columns: STableProps['columns'] = [
    {
      title: t('款式'),
      name: 'name',
      code: 'name',
      width: 230,
      lock: true,
      render: (names: VariantName[]) => {
        return names.map((name) => name.value).join(' - ')
      }
    },
    {
      title: t('售价'),
      name: 'price',
      code: 'price',
      width: 140,
      render: (price) => (
        <SInputNumber
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
  ]

  useEffect(() => {
    worker.toListWorker.onmessage = (e) => {
      setVariants(e.data.variants || [])
      setOptions(e.data.options?.filter((i: any) => i.label) || [])
    }
  }, [])

  return (
    <SCard title={t('多款式')} style={{ marginTop: 16 }}>
      <Flex gap={20} align={'center'} justify={'space-between'}>
        <Flex wrap={'wrap'} gap={8} align={'center'}>
          <SRender render={options.length}>
            <div className={styles.label} style={{ flexShrink: 0 }}>
              {t('筛选')}
            </div>
          </SRender>
          {
              options.map(option => (
                <SSelect
                  style={{ flex: 1 }}
                  allowClear
                  placeholder={option.label}
                  key={option.id}
                  size={'small'}
                  options={option.values.map(value => ({ label: value, value }))}
                  dropdownStyle={{ minWidth: 200 }}
                />
              ))
            }
        </Flex>
        <Flex gap={12} align={'center'}>
          <SSelect value={'所有地点'} size={'small'} />
          <div>
            <IconButton size={26}>
              <IconMaximize size={16} />
            </IconButton>
          </div>
        </Flex>
      </Flex>

      <STable
        style={{ marginTop: 8, marginLeft: -16, marginRight: -16 }}
        data={variants}
        columns={columns}
        rowSelection={{ onChange: setSelected, value: selected }}
      />
    </SCard>
  )
}
