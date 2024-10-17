import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconChevronDown } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Form, Input, Popover } from 'antd'
import dayjs, { Dayjs } from 'dayjs'

import { useCarriers } from '@/api/base/carriers'
import { useCurrencyList } from '@/api/base/currency-list'
import { PurchaseCreateApi } from '@/api/purchase/create'
import { PurchaseInfoApi, PurchaseStatus } from '@/api/purchase/info'
import { PurchaseMarkToOrderedApi } from '@/api/purchase/markToOrdered'
import { PurchaseRemoveApi } from '@/api/purchase/remove'
import { PurchaseUpdateApi } from '@/api/purchase/update'
import FormRender from '@/components/form-render'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SDatePicker from '@/components/s-date-picker'
import { sMessage } from '@/components/s-message'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import { getPaymentTerms } from '@/constant/purchase'
import { useI18n } from '@/hooks/use-lang'
import CostSummary from '@/pages/mange/product/purchase/change/cost-summary'
import Destination from '@/pages/mange/product/purchase/change/destination'
import Products from '@/pages/mange/product/purchase/change/products'
import Progress from '@/pages/mange/product/purchase/change/progress'
import Supplier from '@/pages/mange/product/purchase/change/supplier'
import { isEqualHandle } from '@/utils/is-equal-handle'
import { renderText } from '@/utils/render-text'

import styles from './index.module.less'

export interface PurchaseChangeInnerProps {
  onFresh: (id: number) => void
}

export default function PurchaseChangeInner (props: PurchaseChangeInnerProps) {
  const { onFresh } = props
  const currencyList = useCurrencyList()
  const carriers = useCarriers()
  const [form] = Form.useForm()
  const t = useI18n()
  const create = useRequest(PurchaseCreateApi, { manual: true })
  const update = useRequest(PurchaseUpdateApi, { manual: true })
  const info = useRequest(PurchaseInfoApi, { manual: true })
  const markToOrdered = useRequest(PurchaseMarkToOrderedApi, { manual: true })
  const remove = useRequest(PurchaseRemoveApi, { manual: true })
  const { id } = useParams()
  const init = useRef<any>()
  const [isChange, setIsChange] = useState(false)
  const nav = useNavigate()

  const paymentTerms = getPaymentTerms(t)

  const isInfo = id && window.location.href.includes('info')

  const onOk = async () => {
    await form.validateFields()
    const { estimated_arrival, ...rest } = form.getFieldsValue()
    const values = {
      ...rest,
      estimated_arrival: estimated_arrival ? (estimated_arrival as Dayjs).unix() : undefined
    }
    if (!values?.purchase_items) {
      sMessage.warning('Please select products')
      return
    }
    if (!values.supplier_id) {
      sMessage.warning('Please select supplier')
      return
    }
    if (id) {
      await update.runAsync({
        id: Number(id),
        ...values
      })
      onFresh(Number(id))
      sMessage.success('Purchase order updated!')
    } else {
      const ret = await create.runAsync(values)
      onFresh(ret.id)
      sMessage.success('Purchase order draft created!')
    }
  }

  // 编辑模式（已订购并且处于编辑的模式）
  const isEditingMode = !isInfo && (info.data?.status !== PurchaseStatus.Draft)

  const onValuesChange = () => {
    const values = form.getFieldsValue()
    if (!init.current?.destination_id || !init.current?.currency_code || (id && !info.data?.id)) {
      init.current = values
    }
    const isSame = isEqualHandle(values, init.current)
    setIsChange(!isSame)
  }

  const onReset = () => {
    form.setFieldsValue(init.current)
    setIsChange(false)
  }

  const markToOrderedHandle = async () => {
    if (!id) return
    await markToOrdered.runAsync({ id: Number(id) })
    onFresh(Number(id))
    sMessage.success('Purchase order marked to ordered!')
    nav(`/products/purchase_orders/info/${id}`)
  }

  const title = useMemo(() => {
    if (isEditingMode) {
      return (
        <Flex gap={8} align={'center'}>
          <div>{t('Edit purchase order')}</div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{info?.data?.order_number}</div>
        </Flex>
      )
    }
    return id ? (info?.data?.order_number || '-') : t('Create purchase order')
  }, [isEditingMode, info.data])

  const backUrl = useMemo(() => {
    if (isEditingMode) return `/products/purchase_orders/info/${id}`
    return '/products/purchase_orders'
  }, [isEditingMode, info.data])

  useEffect(() => {
    if (id) return
    if (!currencyList.data?.length) return
    form.setFieldsValue({ currency_code: currencyList.data[0].code })
    onValuesChange()
  }, [currencyList.data])

  useEffect(() => {
    if (id) return
    form.setFieldValue('payment_terms', 0)
  }, [])

  useEffect(() => {
    if (!id) return
    info.runAsync({ id: Number(id) }).then(res => {
      const { estimated_arrival, ...rest } = res
      form.setFieldsValue({
        ...rest,
        estimated_arrival: estimated_arrival ? dayjs(estimated_arrival * 1000) : undefined
      })
      onValuesChange()
    })
  }, [id])

  return (
    <Page
      footer={
        <SRender render={info?.data?.destination_id ? !isInfo : null}>
          <Flex flex={1} align={'center'}>
            <Button type={'primary'} danger>Delete</Button>
          </Flex>
        </SRender>
      }
      header={
        <SRender render={info.data?.status ? !isEditingMode : null}>
          <Flex gap={12} align={'center'}>
            <SRender render={![1, 5].includes(info?.data?.status || 0)}>
              <Button onClick={() => { nav(`/products/purchase_orders/change/${id}`) }} type={'text'}>
                {t('编辑')}
              </Button>
            </SRender>
            <Popover
              trigger={'click'}
              content={
                <Flex vertical>
                  <SRender render={![1, 5].includes(info?.data?.status || 0)}>
                    <Button style={{ textAlign: 'left', fontWeight: 500 }} type={'text'} block>关闭采购订单</Button>
                  </SRender>
                  <Button style={{ textAlign: 'left', fontWeight: 500 }} type={'text'} block>导出DPF</Button>
                </Flex>
              }
              arrow={false}
              placement={'bottom'}
              overlayInnerStyle={{ minWidth: 'fit-content' }}
            >
              <Button type={'text'}>
                {t('更多操作')}
                <IconChevronDown size={14} />
              </Button>
            </Popover>
            <SRender render={info.data?.status === PurchaseStatus.Draft}>
              <Button onClick={markToOrderedHandle} loading={markToOrdered.loading} type={'primary'}>
                {t('标记为已订购')}
              </Button>
            </SRender>
            <SRender render={![1, 5].includes(info?.data?.status || 0)}>
              <Button type={'primary'}>
                {t('接收库存')}
              </Button>
            </SRender>
          </Flex>
        </SRender>
      }
      onCancel={onReset}
      loading={carriers.loading || currencyList.loading || info.loading}
      onOk={onOk}
      isChange={isInfo ? undefined : isChange}
      bottom={64}
      type={'product'}
      width={950}
      title={title}
      back={backUrl}
    >
      <Form onValuesChange={onValuesChange} form={form} layout={'vertical'}>
        <div className={styles.card}>
          <Flex>
            <div className={styles.item}>
              <div className={styles.title}>{t('Supplier')}</div>
              <Form.Item style={{ margin: 0 }} name={'supplier_id'}>
                <Supplier infoMode={isInfo} />
              </Form.Item>
            </div>
            <div className={styles.item}>
              <div className={styles.title}>{t('Destination')}</div>
              <Form.Item style={{ margin: 0, padding: 0 }} name={'destination_id'}>
                <Destination infoMode={isInfo} onValuesChange={onValuesChange} />
              </Form.Item>
            </div>
          </Flex>
          <div className={'line'} style={{ margin: 0 }} />
          <Flex gap={16} style={{ padding: 16, paddingBottom: 0 }} >
            <Form.Item name={'payment_terms'} className={'flex1'} label={t('Payment Terms')}>
              <FormRender infoMode={isInfo} render={(value?: number) => (paymentTerms)[value || 0]?.label}>
                <SSelect options={paymentTerms} />
              </FormRender>
            </Form.Item>
            <Form.Item name={'currency_code'} label={t('Supplier currency')} className={'flex1'}>
              <FormRender infoMode={isInfo} render={(code?: string) => currencyList?.data?.find(item => item.code === code)?.title}>
                <SSelect
                  listHeight={400}
                  showSearch
                  optionFilterProp={'label'}
                  options={currencyList.data?.map(item => ({ value: item.code, label: item.title }))}
                />
              </FormRender>
            </Form.Item>
            <SRender render={isInfo}>
              <Flex gap={20} flex={2} vertical>
                <Progress />
                <Flex gap={16} justify={'flex-end'}>
                  <Flex gap={4} align={'center'}>
                    <div style={{ background: '#2e7d32' }} className={styles.progressBlock} />
                    已收货
                  </Flex>
                  <Flex gap={4} align={'center'}>
                    <div style={{ background: '#d32f2f' }} className={styles.progressBlock} />
                    已拒收
                  </Flex>
                  <Flex gap={4} align={'center'}>
                    <div style={{ background: '#c6c6c6' }} className={styles.progressBlock} />
                    未收货
                  </Flex>
                  <Flex gap={4} align={'center'}>
                    总额
                  </Flex>
                </Flex>
              </Flex>
            </SRender>
          </Flex>
        </div>

        <SCard style={{ marginBottom: 16 }} title={t('Shipping details')}>
          <Flex gap={16}>
            <Form.Item name={'estimated_arrival'} label={t('Estimated Arrival')} className={'flex1 mb0'}>
              <FormRender render={(value?: number) => (value ? dayjs(value * 1000).format('YYYY-MM-DD') : renderText())} infoMode={isInfo}>
                <SDatePicker allowClear rootClassName={'fit-width'} />
              </FormRender>
            </Form.Item>
            <Form.Item name={'carrier_id'} label={t('Shipping carrier')} className={'flex1 mb0'}>
              <FormRender infoMode={isInfo} render={(value?: number) => (carriers.data?.find(item => item.id === value)?.name)}>
                <SSelect
                  allowClear
                  showSearch
                  optionFilterProp={'label'}
                  options={carriers.data?.map(item => ({ value: item.id, label: item.name }))}
                />
              </FormRender>
            </Form.Item>
            <Form.Item
              name={'delivery_number'}
              label={t('Delivery number')}
              className={'flex1 mb0'}
            >
              <FormRender infoMode={isInfo} render={v => v}>
                <Input autoComplete={'off'} />
              </FormRender>
            </Form.Item>
          </Flex>
        </SCard>

        <Form.Item name={'purchase_items'}>
          <Products infoMode={isInfo} />
        </Form.Item>

        <Flex gap={16}>
          <Form.Item className={'mb0 flex1'} name={'adjust'}>
            <CostSummary infoMode={isInfo} />
          </Form.Item>

          <SCard className={'flex1'} title={t('Remarks')} style={{ marginTop: 16 }}>
            <Form.Item className={'mb0'} name={'remarks'}>
              <FormRender render={v => v} infoMode={isInfo}>
                <Input.TextArea autoSize={{ minRows: 4 }} />
              </FormRender>
            </Form.Item>
          </SCard>
        </Flex>
      </Form>

    </Page>
  )
}
