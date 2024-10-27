import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconTrash } from '@tabler/icons-react'
import { Button, Flex, Form } from 'antd'

import { useCurrencyList } from '@/api/base/currency-list'
import { BaseShippingZoneFeeCondition, ShippingZoneFeeRule, ShippingZoneFeeType } from '@/api/shipping/base'
import IconButton from '@/components/icon-button'
import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'

const loop = () => {}

export default function FeeCondition () {
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const currencyList = useCurrencyList()
  const form = Form.useFormInstance()
  const rule: ShippingZoneFeeRule = Form.useWatch('rule', form)
  const type: ShippingZoneFeeType = Form.useWatch('type', form)
  const currency_code = Form.useWatch('currency_code', form)
  const weight_unit = Form.useWatch('weight_unit', form)
  const currency = currencyList?.data?.find(item => item.code === currency_code)
  const addRef = useRef<(value: any) => void>(loop)
  const removeRef = useRef<(index: number) => void>(loop)
  const [forceUpdate, setForceUpdate] = useState(0)

  const getConditions = () => form.getFieldValue('conditions') || []

  const options = [
    { label: t('按订单总价'), value: ShippingZoneFeeRule.OrderPrice },
    { label: t('按商品总价'), value: ShippingZoneFeeRule.ProductPrice },
    { label: t('按商品件数'), value: ShippingZoneFeeRule.ProductCount },
    { label: t('按包裹重量'), value: ShippingZoneFeeRule.OrderWeight }
  ]

  const isCount = type === ShippingZoneFeeType.Count

  const isPriceRange = rule === ShippingZoneFeeRule.OrderPrice || rule === ShippingZoneFeeRule.ProductPrice
  const isCountRange = rule === ShippingZoneFeeRule.ProductCount

  const onUpdate = () => {
    setTimeout(() => {
      setForceUpdate(forceUpdate + 1)
    })
  }

  const onRemoveItem = (name: number) => {
    removeRef?.current(name)
    onUpdate()
  }

  const onAdd = () => {
    const conditions = getConditions()
    const last = conditions[conditions?.length - 1]
    const item = { min: last?.max, fixed: 0, first: 0, first_fee: 0, next: 0, next_fee: 0 }
    addRef.current(item)
    setTimeout(() => {
      document.getElementById('form_id_scroll_handle_to_bottom')?.scrollTo({ left: 0, top: 1000 })
    })
    onUpdate()
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
      code: 'name',
      name: 'name',
      render: (name: number) => {
        return (
          <Flex gap={8} align={'center'}>
            <Form.Item className={'mb0'} name={[name, 'min']}>
              <SInputNumber
                disabled={name !== 0}
                required
                uint={isCountRange}
                money={isPriceRange}
                prefix={isPriceRange ? currency?.symbol : undefined}
                suffix={rangeSuffix}
              />
            </Form.Item>
            -
            <Form.Item
              rules={[{
                validator: async (rule, value) => {
                  const conditions = getConditions()
                  const next = conditions[name + 1]
                  const isLast = !next
                  if (isLast && !value) {
                    await Promise.resolve(); return
                  }
                  if (value === undefined) {
                    await Promise.reject(t('请填写结束区间')); return
                  }
                  if (value <= conditions[name].min) {
                    await Promise.reject(t('结束区间不能小于开始区间'))
                  }
                }
              }]}
              name={[name, 'max']}
              className={'mb0'}
            >
              <SInputNumber
                uint={isCountRange}
                money={isPriceRange}
                prefix={isPriceRange ? currency?.symbol : undefined}
                suffix={rangeSuffix}
                placeholder={getConditions()?.[name + 1] ? undefined : t('无上限')}
                onChange={(v) => {
                  const conditions = getConditions()
                  if (conditions[name + 1]) {
                    conditions[name + 1].min = v
                    form.setFieldValue('conditions', [...conditions])
                  }
                  form.validateFields({ dirty: true })
                }}
              />
            </Form.Item>
          </Flex>
        )
      },
      width: 250,
      hidden: !rule
    },
    {
      title: t('运费'),
      code: 'name',
      name: 'name',
      render: (name: number) => (
        <Form.Item name={[name, 'fixed']} className={'mb0'}>
          <SInputNumber money />
        </Form.Item>
      ),
      width: 150,
      hidden: type !== ShippingZoneFeeType.Fixed
    },
    {
      title: isCount ? t('首件') : t('首重'),
      code: 'name',
      name: 'name',
      render: (name: number) => (
        <Form.Item
          rules={[{
            validator: async (rule, value) => {
              if (value === undefined) {
                await Promise.reject(isCount ? t('请输入首重') : t('请输入首件'))
                return
              }
              if (value <= 0) {
                await Promise.reject(isCount ? t('首重必须大于0') : t('首件必须大于0'))
              }
            }
          }]}
          name={[name, 'first']}
          className={'mb0'}
        >
          <SInputNumber
            required
            suffix={isCount ? t('件') : weight_unit}
          />
        </Form.Item>
      ),
      width: 150,
      hidden: type === ShippingZoneFeeType.Fixed
    },
    {
      title: isCount ? t('首件费用') : t('首重费用'),
      code: 'name',
      name: 'name',
      render: (name: number) => (
        <Form.Item name={[name, 'first_fee']} className={'mb0'}>
          <SInputNumber
            money
            prefix={currency?.symbol}
          />
        </Form.Item>
      ),
      width: 150,
      hidden: type === ShippingZoneFeeType.Fixed
    },
    {
      title: isCount ? t('续件') : t('续重'),
      code: 'name',
      name: 'name',
      render: (name: number) => (
        <Form.Item
          rules={[{
            validator: async (rule, value) => {
              if (value === undefined) {
                await Promise.reject(isCount ? t('请输入续重') : t('请输入续件'))
                return
              }
              if (value <= 0) {
                await Promise.reject(isCount ? t('续重必须大于0') : t('续件必须大于0'))
              }
            }
          }]}
          name={[name, 'next']}
          className={'mb0'}
        >
          <SInputNumber
            required
            suffix={isCount ? t('件') : weight_unit}
          />
        </Form.Item>
      ),
      width: 150,
      hidden: type === ShippingZoneFeeType.Fixed
    },
    {
      title: isCount ? t('续件费用') : t('续重费用'),
      code: 'name',
      name: 'name',
      render: (name: number) => (
        <Form.Item name={[name, 'next_fee']} className={'mb0'}>
          <SInputNumber
            money
            prefix={currency?.symbol}
          />
        </Form.Item>
      ),
      width: 150,
      hidden: type === ShippingZoneFeeType.Fixed
    },
    {
      title: '',
      code: 'name',
      name: 'name',
      width: 60,
      align: 'center',
      render: (name: number) => (
        <Flex justify={'center'}>
          <IconButton onClick={() => { onRemoveItem(name) }} size={24} type={'text'}>
            <IconTrash size={15} />
          </IconButton>
        </Flex>
      ),
      hidden: getConditions()?.length <= 1
    },
    {
      title: '',
      code: 'none',
      name: 'none',
      width: 300,
      hidden: type !== ShippingZoneFeeType.Fixed
    }
  ]

  useEffect(() => {
    if (rule === ShippingZoneFeeRule.ProductCount) {
      form.setFieldValue(
        'conditions',
        getConditions().map((item: BaseShippingZoneFeeCondition) => {
          return { ...item, min: Math.round(item.min), max: item.max ? Math.round(item.max) : undefined }
        })
      )
    }
  }, [rule])

  if (getConditions()?.length === 1 && type === ShippingZoneFeeType.Fixed && !rule) {
    return (
      <Flex
        align={'center'} style={{ marginBottom: 16, width: 400 }}
      >
        <div style={{ flexShrink: 0 }}>{t('运费价格：')}</div>
        <SInputNumber
          onChange={v => { form.setFieldValue('conditions', [{ ...(getConditions()?.[0] || {}), fixed: v }]) }}
          required
          value={getConditions()[0].fixed}
          money
        />
      </Flex>
    )
  }

  return (
    <div>
      <Form.List name={'conditions'}>
        {
          (fields, { add, remove }) => {
            addRef.current = add
            removeRef.current = remove
            return (
              <STable
                init
                borderless
                className={'table-border'}
                data={fields || []}
                columns={columns}
              />
            )
          }
        }
      </Form.List>
      <SRender render={rule ? (getConditions()?.length || 0) < 20 : null}>
        <Button style={{ marginTop: 16 }} onClick={onAdd}>{t('添加区间')}</Button>
      </SRender>
    </div>
  )
}
