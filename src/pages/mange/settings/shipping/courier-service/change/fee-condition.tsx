import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconTrash } from '@tabler/icons-react'
import { Button, Flex, Form } from 'antd'

import { useCurrencyList } from '@/api/base/currency-list'
import { BaseShippingZoneFeeCondition, ShippingZoneFeeRule, ShippingZoneFeeType } from '@/api/shipping/base'
import IconButton from '@/components/icon-button'
import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import { genId } from '@/utils/random'

import styles from './index.module.less'

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

  const [errMsg, setErrMsg] = useState<Record<string, string>>()

  const options = [
    { label: t('按订单总价'), value: ShippingZoneFeeRule.OrderPrice },
    { label: t('按商品总价'), value: ShippingZoneFeeRule.ProductPrice },
    { label: t('按商品件数'), value: ShippingZoneFeeRule.ProductCount },
    { label: t('按包裹重量'), value: ShippingZoneFeeRule.OrderWeight }
  ]

  const isCount = type === ShippingZoneFeeType.Count

  const isPriceRange = rule === ShippingZoneFeeRule.OrderPrice || rule === ShippingZoneFeeRule.ProductPrice
  const isCountRange = rule === ShippingZoneFeeRule.ProductCount

  const onUpdateItem = (row: BaseShippingZoneFeeCondition, key: keyof BaseShippingZoneFeeCondition, v: any) => {
    row[key] = v
    onChange?.(value?.map(item => ({ ...item, currency_code })) || [])
    onCheckErr()
  }

  const onRemoveItem = (id: number) => {
    onChange?.(value?.filter(i => i.id !== id) || [])
  }

  const onCheckErr = () => {
    const values = form.getFieldsValue()
    const conditions: BaseShippingZoneFeeCondition[] = values.conditions || []
    const err: Record<string, string> = {}
    conditions.forEach((item, index) => {
      if (item.max && item.min > item.max) {
        err[`${item.id}_max`] = t('结束区间必须大于起始区间')
      }
      if (type === ShippingZoneFeeType.Count && !item.first) {
        err[`${item.id}_first_count`] = t('首件数量必须大于 0')
      }
      if (type === ShippingZoneFeeType.Count && !item.next) {
        err[`${item.id}_next_count`] = t('续件数量必须大于 0')
      }
      if (type === ShippingZoneFeeType.Weight && !item.first) {
        err[`${item.id}_first_weight`] = t('首重必须大于 0')
      }
      if (type === ShippingZoneFeeType.Weight && !item.next) {
        err[`${item.id}_next_weight`] = t('续重必须大于 0')
      }
    })
    setErrMsg(err)
    return err
  }

  const onAdd = () => {
    onChange?.([...(value || []), {
      id: genId(),
      min: 0,
      fixed: 0,
      first: 0,
      first_fee: 0,
      next: 0,
      next_fee: 0
    }])
    setTimeout(() => {
      document.getElementById('form_id_scroll_handle_to_bottom')?.scrollTo({ left: 0, top: 1000 })
    })
  }

  const rangeSuffix = useMemo(() => {
    if (rule === ShippingZoneFeeRule.ProductCount) {
      return t('件')
    }
    if (rule === ShippingZoneFeeRule.OrderWeight) {
      return weight_unit
    }
  }, [rule, weight_unit])

  const columns: STableProps['columns'] = [
    {
      title: options.find(item => item.value === rule)?.label,
      code: 'march_rule',
      name: 'march_rule',
      render: (_, row: BaseShippingZoneFeeCondition) => {
        return (
          <div>
            <Flex gap={8} align={'center'}>
              <SInputNumber
                required
                value={row.min}
                uint={isCountRange}
                money={isPriceRange}
                prefix={isPriceRange ? currency?.symbol : undefined}
                suffix={rangeSuffix}
                onChange={v => { onUpdateItem(row, 'min', v) }}
              />
              <div>-</div>
              <SInputNumber
                value={row.max}
                uint={isCountRange}
                money={isPriceRange}
                prefix={isPriceRange ? currency?.symbol : undefined}
                suffix={rangeSuffix}
                placeholder={t('无限制')}
                onChange={v => { onUpdateItem(row, 'max', v) }}
              />
            </Flex>
            <div className={styles.err}>{errMsg?.[`${row.id}_max`]}</div>
          </div>
        )
      },
      width: 250,
      hidden: !rule
    },
    {
      title: t('运费'),
      code: 'fixed',
      name: 'fixed',
      render: (fixed: number, row: BaseShippingZoneFeeCondition) => (
        <SInputNumber
          onChange={v => { onUpdateItem(row, 'fixed', v) }}
          value={fixed}
          money
        />
      ),
      width: 150,
      hidden: type !== ShippingZoneFeeType.Fixed
    },
    {
      title: isCount ? t('首件') : t('首重'),
      code: 'first',
      name: 'first',
      render: (first: number, row: BaseShippingZoneFeeCondition) => (
        <div>
          <SInputNumber
            required
            onChange={v => { onUpdateItem(row, 'first', v) }}
            value={first}
            suffix={isCount ? t('件') : weight_unit}
          />
          <div className={styles.err}>{errMsg?.[`${row.id}_first_${isCount ? 'count' : 'weight'}`]}</div>
        </div>
      ),
      width: 150,
      hidden: type === ShippingZoneFeeType.Fixed
    },
    {
      title: isCount ? t('首件费用') : t('首重费用'),
      code: 'first_fee',
      name: 'first_fee',
      render: (first_fee: number, row: BaseShippingZoneFeeCondition) => (
        <SInputNumber
          onChange={v => { onUpdateItem(row, 'first_fee', v) }}
          value={first_fee}
          money
          prefix={currency?.symbol}
        />
      ),
      width: 150,
      hidden: type === ShippingZoneFeeType.Fixed
    },
    {
      title: isCount ? t('续件') : t('续重'),
      code: 'next',
      name: 'next',
      render: (next: number, row: BaseShippingZoneFeeCondition) => (
        <div>
          <SInputNumber
            required
            onChange={v => { onUpdateItem(row, 'next', v) }}
            value={next}
            suffix={isCount ? t('件') : weight_unit}
          />
          <div className={styles.err}>{errMsg?.[`${row.id}_next_${isCount ? 'count' : 'weight'}`]}</div>
        </div>
      ),
      width: 150,
      hidden: type === ShippingZoneFeeType.Fixed
    },
    {
      title: isCount ? t('续件费用') : t('续重费用'),
      code: 'next_fee',
      name: 'next_fee',
      render: (next_fee: number, row: BaseShippingZoneFeeCondition) => (
        <SInputNumber
          onChange={v => { onUpdateItem(row, 'next_fee', v) }}
          value={next_fee}
          money
          prefix={currency?.symbol}
        />
      ),
      width: 150,
      hidden: type === ShippingZoneFeeType.Fixed
    },
    {
      title: '',
      code: 'id',
      name: 'id',
      width: 80,
      align: 'center',
      render: (id: number) => (
        <Flex justify={'center'}>
          <IconButton onClick={() => { onRemoveItem(id) }} size={24} type={'text'}>
            <IconTrash size={15} />
          </IconButton>
        </Flex>
      ),
      hidden: value?.length === 1
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
        <SInputNumber required onChange={v => { onUpdateItem(value[0], 'fixed', v) }} value={value[0].fixed} money />
      </Flex>
    )
  }

  return (
    <div>
      <STable
        init
        borderless
        className={'table-border'}
        data={value || []}
        columns={columns}
      />
      <SRender render={rule ? (value?.length || 0) < 20 : null}>
        <Button style={{ marginTop: 16 }} onClick={onAdd}>{t('添加区间')}</Button>
      </SRender>
    </div>
  )
}
