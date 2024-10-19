import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconChevronDown } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Form, Input, Popover } from 'antd'
import dayjs, { Dayjs } from 'dayjs'

import { useCarriers } from '@/api/base/carriers'
import { useCurrencyList } from '@/api/base/currency-list'
import { PurchaseCloseApi } from '@/api/purchase/close'
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
import { useModal } from '@/components/s-modal'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import { getPaymentTerms, getPurchaseStatus } from '@/constant/purchase'
import { useI18n } from '@/hooks/use-lang'
import CostSummary from '@/pages/mange/product/purchase/change/cost-summary'
import Destination from '@/pages/mange/product/purchase/change/destination'
import Detail from '@/pages/mange/product/purchase/change/detail'
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
  const close = useRequest(PurchaseCloseApi, { manual: true })
  const { id } = useParams()
  const init = useRef<any>()
  const [isChange, setIsChange] = useState(false)
  const nav = useNavigate()
  const modal = useModal()
  const paymentTerms = getPaymentTerms(t)

  const isReadMode = id && window.location.href.includes('info')
  const isDraftStatus = info?.data?.status === PurchaseStatus.Draft
  const isNonEditableStatus = [1, 5].includes(info?.data?.status || 0)
  const isClosedStatus = info?.data?.status === PurchaseStatus.Closed
  const [open, setOpen] = useState(false)

  const onOk = async () => {
    await form.validateFields()
    const { estimated_arrival, ...rest } = form.getFieldsValue()
    const values = {
      ...rest,
      estimated_arrival: estimated_arrival ? (estimated_arrival as Dayjs).unix() : undefined
    }
    if (!values?.purchase_items) {
      sMessage.warning(t('请选择商品'))
      return
    }
    if (!values.supplier_id) {
      sMessage.warning(t('请选择供应商'))
      return
    }
    if (id) {
      await update.runAsync({
        id: Number(id),
        ...values
      })
      onFresh(Number(id))
      sMessage.success(t('采购单已更新'))
      nav(`/products/purchase_orders/info/${id}`)
    } else {
      const ret = await create.runAsync(values)
      onFresh(ret.id)
      sMessage.success(t('采购单已创建'))
    }
  }

  // 编辑模式（已订购并且处于编辑的模式）
  const isEditingMode = id && !isReadMode && !isDraftStatus

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

  const onClose = async () => {
    await close.runAsync({ id: Number(id), close: info?.data?.status !== PurchaseStatus.Closed })
    info.refresh()
    sMessage.success(t(`采购单已${!isClosedStatus ? t('关闭') : t('开启')}`))
    setOpen(false)
  }

  const onRemove = () => {
    modal.confirm({
      title: t('删除采购订单？'),
      content: t('刪除此采购订单后无法撤销'),
      okButtonProps: { danger: true },
      okText: t('删除'),
      onOk: async () => {
        await remove.runAsync({ id: Number(id) })
        onFresh(Number(id))
        sMessage.success(t('删除成功'))
        nav('/products/purchase_orders')
      }
    })
  }

  const markToOrderedHandle = async () => {
    if (!id) return
    modal.confirm({
      title: t('是否标记为已订购？'),
      content: t('标记为已订购后，您将能够从供应商处接收进货。此采购订单无法再次变更为草稿状态'),
      onOk: async () => {
        await markToOrdered.runAsync({ id: Number(id) })
        onFresh(Number(id))
        sMessage.success(t('标记成功'))
        nav(`/products/purchase_orders/info/${id}`)
      }
    })
  }

  const title = useMemo(() => {
    if (isEditingMode) {
      return (
        <Flex gap={8} align={'center'}>
          <div>{t('编辑采购单')}</div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{info?.data?.order_number}</div>
        </Flex>
      )
    }
    return id ? (info?.data?.order_number || '-') : t('创建采购单')
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
        <SRender render={info?.data?.destination_id ? (!isReadMode && !isEditingMode) : null}>
          <Flex flex={1} align={'center'}>
            <Button type={'primary'} danger onClick={onRemove}>{t('删除')}</Button>
          </Flex>
        </SRender>
      }
      header={
        <SRender render={info.data?.status ? !isEditingMode : null}>
          <Flex gap={12} align={'center'}>
            <SRender render={!isNonEditableStatus}>
              <Button onClick={() => { nav(`/products/purchase_orders/change/${id}`) }} type={'text'}>
                {t('编辑')}
              </Button>
            </SRender>
            <Popover
              trigger={'click'}
              content={
                <Flex vertical>
                  <SRender render={!isNonEditableStatus || isClosedStatus}>
                    <Button loading={close.loading} onClick={onClose} style={{ textAlign: 'left', fontWeight: 500 }} type={'text'} block>
                      {
                        info?.data?.status === PurchaseStatus.Closed ? t('开启采购订单') : t('关闭采购订单')
                      }
                    </Button>
                  </SRender>
                  <Button style={{ textAlign: 'left', fontWeight: 500 }} type={'text'} block>{t('导出DPF')}</Button>
                </Flex>
              }
              open={open}
              onOpenChange={setOpen}
              arrow={false}
              placement={'bottom'}
              overlayInnerStyle={{ minWidth: 'fit-content' }}
            >
              <Button type={'text'}>
                {t('更多操作')}
                <IconChevronDown size={14} />
              </Button>
            </Popover>
            <SRender render={isDraftStatus}>
              <Button onClick={markToOrderedHandle} type={'primary'}>
                {t('标记为已订购')}
              </Button>
            </SRender>
            <SRender render={!isNonEditableStatus}>
              <Button onClick={() => { nav(`/products/purchase_orders/receive/${id}`) }} type={'primary'}>
                {t('接收库存')}
              </Button>
            </SRender>
          </Flex>
        </SRender>
      }
      onCancel={onReset}
      loading={carriers.loading || currencyList.loading || info.loading || (!!id && !info?.data?.status)}
      onOk={onOk}
      isChange={isReadMode ? undefined : isChange}
      bottom={120}
      type={'product'}
      width={950}
      title={
        <Flex align={'center'} gap={8}>
          {title}
          {getPurchaseStatus(t, info?.data?.status)}
        </Flex>
      }
      back={backUrl}
      okText={!id ? t('保存为草稿') : t('保存')}
    >
      <Form onValuesChange={onValuesChange} form={form} layout={'vertical'}>
        <div className={styles.card}>
          <Flex>
            <div className={styles.item}>
              <div className={styles.title}>{t('供应商')}</div>
              <Form.Item style={{ margin: 0 }} name={'supplier_id'}>
                <Supplier infoMode={id ? isReadMode || !isDraftStatus : null} />
              </Form.Item>
            </div>
            <div className={styles.item}>
              <div className={styles.title}>{t('目的地')}</div>
              <Form.Item style={{ margin: 0, padding: 0 }} name={'destination_id'}>
                <Destination infoMode={id ? isReadMode || !(isDraftStatus) : null} onValuesChange={onValuesChange} />
              </Form.Item>
            </div>
          </Flex>
          <div className={'line'} style={{ margin: 0 }} />
          <Flex gap={16} style={{ padding: 16, paddingBottom: 0 }} >
            <Form.Item name={'payment_terms'} className={'flex1'} label={t('支付条款')}>
              <FormRender infoMode={isReadMode} render={(value?: number) => (paymentTerms)[value || 0]?.label}>
                <SSelect options={paymentTerms} />
              </FormRender>
            </Form.Item>
            <Form.Item name={'currency_code'} label={t('供应商货币')} className={'flex1'}>
              <FormRender infoMode={isReadMode} render={(code?: string) => currencyList?.data?.find(item => item.code === code)?.title}>
                <SSelect
                  listHeight={400}
                  showSearch
                  optionFilterProp={'label'}
                  options={currencyList.data?.map(item => ({ value: item.code, label: item.title }))}
                />
              </FormRender>
            </Form.Item>
            <SRender render={isReadMode}>
              <Flex gap={20} flex={2} vertical>
                <Progress
                  rejected={info?.data?.rejected || 0}
                  received={info?.data?.received || 0}
                  purchasing={info?.data?.purchasing || 0}
                />
                <Detail
                  rejected={info?.data?.rejected || 0}
                  received={info?.data?.received || 0}
                  purchasing={info?.data?.purchasing || 0}
                />
              </Flex>
            </SRender>
          </Flex>
        </div>

        <SCard style={{ marginBottom: 16 }} title={t('运输详细信息')}>
          <Flex gap={16}>
            <Form.Item name={'estimated_arrival'} label={t('预计配送日期')} className={'flex1 mb0'}>
              <FormRender render={(value?: number) => (value ? dayjs(value).format('YYYY-MM-DD') : renderText())} infoMode={isReadMode}>
                <SDatePicker allowClear rootClassName={'fit-width'} />
              </FormRender>
            </Form.Item>
            <Form.Item name={'carrier_id'} label={t('物流提供商')} className={'flex1 mb0'}>
              <FormRender infoMode={isReadMode} render={(value?: number) => (carriers.data?.find(item => item.id === value)?.name)}>
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
              label={t('物流单号')}
              className={'flex1 mb0'}
            >
              <FormRender infoMode={isReadMode} render={v => v}>
                <Input autoComplete={'off'} />
              </FormRender>
            </Form.Item>
          </Flex>
        </SCard>

        <Form.Item name={'purchase_items'}>
          <Products status={info?.data?.status} infoMode={isReadMode} />
        </Form.Item>

        <Flex gap={16}>
          <Form.Item className={'mb0 flex1'} name={'adjust'}>
            <CostSummary infoMode={isReadMode} />
          </Form.Item>

          <SCard className={'flex1'} title={t('备注')} style={{ marginTop: 16 }}>
            <Form.Item className={'mb0'} name={'remarks'}>
              <FormRender render={v => v} infoMode={isReadMode}>
                <Input.TextArea autoSize={{ minRows: 4 }} />
              </FormRender>
            </Form.Item>
          </SCard>
        </Flex>
      </Form>

    </Page>
  )
}
