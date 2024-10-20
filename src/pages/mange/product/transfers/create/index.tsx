import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Button, Flex, Form, Input } from 'antd'
import dayjs, { Dayjs } from 'dayjs'

import { useCarriers } from '@/api/base/carriers'
import { LocationListApi } from '@/api/location/list'
import { TransferCreateApi } from '@/api/transfers/create'
import { TransferInfoApi } from '@/api/transfers/info'
import { TransferMarkApi } from '@/api/transfers/mark'
import { TransferRemoveApi } from '@/api/transfers/remove'
import { TransferUpdateApi } from '@/api/transfers/update'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SDatePicker from '@/components/s-date-picker'
import { sMessage } from '@/components/s-message'
import { useModal } from '@/components/s-modal'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import { getTransferStatus, TransferStatus } from '@/constant/transfers'
import { useI18n } from '@/hooks/use-lang'
import Detail from '@/pages/mange/product/purchase/change/detail'
import styles from '@/pages/mange/product/purchase/change/index.module.less'
import Progress from '@/pages/mange/product/purchase/change/progress'
import LocationItem from '@/pages/mange/product/transfers/create/location-item'
import Products from '@/pages/mange/product/transfers/create/products'
import { isEqualHandle } from '@/utils/is-equal-handle'

export default function Create () {
  const locations = useRequest(async () => await LocationListApi({ active: true }))
  const carriers = useCarriers()
  const nav = useNavigate()
  const t = useI18n()
  const [form] = Form.useForm()
  const create = useRequest(TransferCreateApi, { manual: true })
  const info = useRequest(TransferInfoApi, { manual: true })
  const mark = useRequest(TransferMarkApi, { manual: true })
  const remove = useRequest(TransferRemoveApi, { manual: true })
  const update = useRequest(TransferUpdateApi, { manual: true })
  const init = useRef<any>()
  const [isChange, setIsChange] = useState(false)
  const { id } = useParams()
  const [loading, setLoading] = useState(false)

  const originId = Form.useWatch('origin_id', form)
  const destinationId = Form.useWatch('destination_id', form)

  const isDraftStatus = info?.data?.status === TransferStatus.Draft
  const isCanReceived = [2, 3, 4].includes(info?.data?.status || 0)
  const modal = useModal()

  const infoMode = useMemo(() => {
    return !!id && info?.data?.items?.some(i => i.rejected || i.received)
  }, [info?.data?.items])

  const onValuesChange = (force?: boolean) => {
    const values = form.getFieldsValue()
    if (!init.current) {
      init.current = values
    }
    if (force === true) {
      init.current = values
    }
    const isSame = isEqualHandle(values, init.current)
    setIsChange(!isSame)
  }

  const onCancel = () => {
    form.setFieldsValue(init.current)
    setIsChange(false)
  }

  // 标记为已收货
  const markToOrdered = async () => {
    if (!id) return
    await mark.runAsync({ id: Number(id) })
    sMessage.success('标记成功')
    info.refresh()
  }

  // 前往收货页面
  const toReceivedPage = () => {
    if (!id) return
    nav(`/products/transfers/received/${id}`)
  }

  const onRemove = async () => {
    if (!id) return
    modal.confirm({
      title: '确定删除此库存转移单吗？',
      content: '此单删除后不能找回，请慎重操作',
      okText: '删除',
      okButtonProps: { danger: true },
      onOk: async () => {
        await remove.runAsync({ id: Number(id) })
        nav('/products/transfers')
        sMessage.success('删除成功')
      }
    })
  }

  const onOk = async () => {
    await form.validateFields()
    if (!originId) {
      sMessage.warning('请选择发货地')
      return
    }
    if (!destinationId) {
      sMessage.warning('请选择目的地')
      return
    }
    if (destinationId === originId) {
      sMessage.warning('发货地和目的地不能相同')
      return
    }
    const values = form.getFieldsValue()
    if (!values.items?.length) {
      sMessage.warning('请选择商品')
      return
    }
    if (values.delivery_number && !values.carrier_id) {
      sMessage.warning('请选择物流提供商')
      return
    }
    const params = { ...values, estimated_arrival: values.estimated_arrival ? (values.estimated_arrival as Dayjs).unix() : undefined }
    if (id) {
      await update.runAsync({ id: Number(id), ...params })
      info.refresh()
      sMessage.success('转移单已更新')
      setIsChange(false)
    } else {
      const ret = await create.runAsync(params)
      nav(`/products/transfers/info/${ret.id}`)
      sMessage.success('转移单已创建')
      setIsChange(false)
    }
  }

  const total = useMemo(() => {
    return {
      quantity: info?.data?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
      rejected: info?.data?.items?.reduce((sum, item) => sum + (item.rejected || 0), 0) || 0,
      received: info?.data?.items?.reduce((sum, item) => sum + (item.received || 0), 0) || 0
    }
  }, [info?.data?.items])

  useEffect(() => {
    if (!id) {
      onValuesChange(true)
    } else if (info.data) {
      const estimated_arrival = info.data.estimated_arrival ? dayjs(info.data.estimated_arrival * 1000) : undefined
      form.setFieldsValue({ ...info.data, estimated_arrival })
      onValuesChange(true)
    }
  }, [info.data])

  useEffect(() => {
    if (!id) return
    info.run({ id: Number(id) })
  }, [id])

  return (
    <Page
      loadingHiddenBg
      onOk={onOk}
      onCancel={onCancel}
      isChange={isChange}
      bottom={64}
      loading={locations.loading || carriers.loading || loading || info.loading}
      back={'/products/transfers'}
      width={950}
      title={(
        <Flex align={'center'} gap={8}>
          <div>{id ? info?.data?.transfer_number || '--' : '创建转移'}</div>
          <div>{getTransferStatus(t, info?.data?.status, false)}</div>
        </Flex>
      )}
      header={
        <div>
          <SRender render={isDraftStatus ? !isChange : null}>
            <Button type={'primary'} onClick={markToOrdered} loading={mark.loading}>标记为待收货</Button>
          </SRender>
          <SRender render={isCanReceived}>
            <Button type={'primary'} onClick={toReceivedPage} loading={mark.loading}>收货</Button>
          </SRender>
        </div>
      }
      footer={
        <SRender render={!infoMode && id}>
          <Flex flex={1} justify={'flex-start'}>
            <Button type={'primary'} danger onClick={onRemove}>删除</Button>
          </Flex>
        </SRender>
      }
      type={'product'}
    >
      <Form onValuesChange={onValuesChange} layout={'vertical'} form={form}>
        <div className={styles.card}>
          <Flex>
            <div className={styles.item}>
              <div className={styles.title}>{t('发货地')}</div>
              <Form.Item className={'p0 m0'} name={'origin_id'}>
                <LocationItem
                  disabledId={destinationId}
                  placeHolder={t('选择发货地')}
                  locations={locations?.data}
                  infoMode={infoMode}
                  onValuesChange={() => {}}
                />
              </Form.Item>
            </div>
            <div className={styles.item}>
              <div className={styles.title}>{t('目的地')}</div>
              <Form.Item className={'p0 m0'} name={'destination_id'}>
                <LocationItem
                  disabledId={originId}
                  placeHolder={t('选择目的地')}
                  locations={locations?.data}
                  infoMode={infoMode}
                  onValuesChange={() => {}}
                />
              </Form.Item>
            </div>
          </Flex>

          <SRender style={{ padding: 16, borderTop: '1px solid #dededf' }} render={(total.received || total.rejected)}>
            <div>
              <Progress purchasing={total.quantity} received={total.received} rejected={total.rejected} />
              <div style={{ marginBottom: 16 }} />
              <Detail purchasing={total.quantity} received={total.received} rejected={total.rejected} />
            </div>
          </SRender>
        </div>

        <Form.Item className={'mb0'} name={'items'}>
          <Products infoMode={infoMode} onLoading={setLoading} />
        </Form.Item>

        <SCard title={'配送信息'} style={{ marginTop: 16 }}>
          <div style={{ maxWidth: 420 }}>
            <div>
              <Form.Item name={'estimated_arrival'} label={t('预计配送日期')}>
                <SDatePicker allowClear />
              </Form.Item>
            </div>
            <Form.Item name={'carrier_id'} label={'物流提供商'}>
              <SSelect
                allowClear
                showSearch
                optionFilterProp={'label'}
                options={carriers.data?.map(item => ({ value: item.id, label: item.name }))}
              />
            </Form.Item>
            <Form.Item
              name={'delivery_number'}
              label={t('物流单号')}
            >
              <Input autoComplete={'off'} />
            </Form.Item>
          </div>
        </SCard>
      </Form>

    </Page>
  )
}
