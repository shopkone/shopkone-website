import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Flex, Form, Input } from 'antd'
import dayjs, { Dayjs } from 'dayjs'

import { useCarriers } from '@/api/base/carriers'
import { LocationListApi } from '@/api/location/list'
import { TransferCreateApi } from '@/api/transfers/create'
import { TransferInfoApi } from '@/api/transfers/info'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SDatePicker from '@/components/s-date-picker'
import { sMessage } from '@/components/s-message'
import SSelect from '@/components/s-select'
import { useI18n } from '@/hooks/use-lang'
import styles from '@/pages/mange/product/purchase/change/index.module.less'
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
  const init = useRef<any>()
  const [isChange, setIsChange] = useState(false)
  const { id } = useParams()

  const originId = Form.useWatch('origin_id', form)
  const destinationId = Form.useWatch('destination_id', form)

  const onValuesChange = () => {
    const values = form.getFieldsValue()
    if (!init.current) {
      init.current = values
    }
    const isSame = isEqualHandle(values, init.current)
    setIsChange(!isSame)
  }

  const onCancel = () => {
    form.setFieldsValue(init.current)
    setIsChange(false)
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
    await create.runAsync(params)
  }

  useEffect(() => {
    if (!id) {
      onValuesChange()
    } else if (info.data) {
      const estimated_arrival = info.data.estimated_arrival ? dayjs(info.data.estimated_arrival * 1000) : undefined
      form.setFieldsValue({ ...info.data, estimated_arrival })
      onValuesChange()
    }
  }, [info.data])

  useEffect(() => {
    if (!id) return
    info.run({ id: Number(id) })
  }, [id])

  return (
    <Page
      onOk={onOk}
      onCancel={onCancel}
      isChange={isChange}
      bottom={64}
      loading={locations.loading || carriers.loading}
      back={'/products/transfers'}
      width={950}
      title={id ? info?.data?.transfer_number || '--' : '创建转移'}
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
                  infoMode={false}
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
                  infoMode={false}
                  onValuesChange={() => {}}
                />
              </Form.Item>
            </div>
          </Flex>
        </div>

        <Form.Item className={'mb0'} name={'items'}>
          <Products />
        </Form.Item>

        <SCard title={'配送信息'} style={{ marginTop: 16 }}>
          <div style={{ maxWidth: 420 }}>
            <div>
              <Form.Item name={'estimated_arrival'} label={t('预计配送日期')}>
                <SDatePicker allowClear />
              </Form.Item>
            </div>
            <Form.Item label={'物流提供商'}>
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
