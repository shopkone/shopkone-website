import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Flex, Form, Radio, Switch } from 'antd'
import cloneDeep from 'lodash/cloneDeep'

import { useCountries } from '@/api/base/countries'
import { useTimezoneList } from '@/api/base/timezone-list'
import { InStorePickUpInfoApi, InStorePickupStatus, InStorePickupTimeUnit } from '@/api/in-store-pickup/info'
import { InStorePickUpUpdateApi } from '@/api/in-store-pickup/update'
import { LocalDeliveryStatus } from '@/api/localDelivery/update'
import { LocationListApi } from '@/api/location/list'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SInputNumber from '@/components/s-input-number'
import SLocation from '@/components/s-location'
import { sMessage } from '@/components/s-message'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import Weeks from '@/pages/mange/settings/shipping/pickup-in-store/change/weeks'
import { isEqualHandle } from '@/utils/is-equal-handle'

import styles from './index.module.less'

export default function Change () {
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const id = Number(useParams().id)
  const info = useRequest(InStorePickUpInfoApi, { manual: true })
  const locations = useRequest(async () => await LocationListApi({ active: true }))
  const update = useRequest(InStorePickUpUpdateApi, { manual: true })
  const countries = useCountries()
  const currentLocation = locations.data?.find(item => info?.data?.location_id === item.id)
  const timezones = useTimezoneList()
  const [form] = Form.useForm()
  const [isChange, setIsChange] = useState(false)
  const init = useRef<any>()

  const has_pickup_eta = Form.useWatch('has_pickup_eta', form)
  const isOpen = Form.useWatch('status', form)

  const InStorePickupTimeUnitOptions = [
    { label: t('分钟'), value: InStorePickupTimeUnit.Minute },
    { label: t('小时'), value: InStorePickupTimeUnit.Hour },
    { label: t('天'), value: InStorePickupTimeUnit.Day }
  ]

  const onCancel = () => {
    form.setFieldsValue(init.current)
    setIsChange(false)
  }

  const onValuesChange = (force?: boolean) => {
    const values = form.getFieldsValue(true)
    if (!init.current || force === true) {
      init.current = cloneDeep(values)
      return
    }
    const isSame = isEqualHandle(values, init.current)
    setIsChange(!isSame)
  }

  const onOk = async () => {
    const values = form.getFieldsValue(true)
    const status = values.status ? LocalDeliveryStatus.Open : LocalDeliveryStatus.Close
    await update.runAsync({
      id: Number(id),
      ...values,
      status
    })
    sMessage.success(t('到店自提更新成功'))
    info.refresh()
    setIsChange(false)
  }

  useEffect(() => {
    if (!id) return
    info.run({ id })
  }, [id])

  useEffect(() => {
    if (info.loading) return
    form.setFieldsValue({
      ...info.data,
      status: info.data?.status === InStorePickupStatus.Open
    })
    onValuesChange(true)
  }, [info.loading])

  return (
    <Page
      onCancel={onCancel}
      isChange={isChange}
      onOk={onOk}
      loadingHiddenBg
      loading={locations.loading || countries.loading || info.loading || timezones.loading}
      title={t('编辑到店自提')}
      width={700}
      back={'/settings/shipping/pickup-in-store'}
    >
      <Form onValuesChange={onValuesChange} form={form} layout={'vertical'}>
        <Flex gap={16} vertical>
          <SCard >
            <SLocation
              hideLoading
              hideTag
              borderless
              style={() => ({ padding: 0 })}
              value={currentLocation ? [currentLocation] : []}
              extra={() => (
                <Form.Item className={'mb0'} name={'status'} valuePropName={'checked'}>
                  <Switch />
                </Form.Item>
              )}
            />
          </SCard>

          <SRender render={isOpen}>
            <SCard title={t('服务设置')}>
              <div className={styles.title}>{t('可到店自提时间')}</div>
              <div className={styles.container}>
                <Form.Item name={'has_pickup_eta'} className={'mb0'}>
                  <Radio.Group options={[{ label: t('预估下单后可取时间'), value: true }]} />
                </Form.Item>
                <SRender render={has_pickup_eta}>
                  <Flex gap={8} style={{ marginLeft: 20 }}>
                    <Form.Item name={'pickup_eta'}>
                      <SInputNumber required uint style={{ width: 207 }} />
                    </Form.Item>
                    <Form.Item name={'pickup_eta_unit'}>
                      <SSelect options={InStorePickupTimeUnitOptions} style={{ minWidth: 150 }} />
                    </Form.Item>
                  </Flex>
                </SRender>
                <Form.Item className={'mb0'} name={'has_pickup_eta'}>
                  <Radio.Group options={[{ label: t('无法预估时间'), value: false }]} />
                </Form.Item>
              </div>

              <div style={{ paddingTop: 16 }} className={styles.title}>{t('当地营业时间')}</div>
              <div className={styles.container}>
                <Form.Item style={{ width: 363 }} label={t('所在时区')}>
                  <SSelect
                    style={{ marginLeft: 24 }}
                    showSearch
                    optionFilterProp={'label'}
                    options={timezones.data?.map(item => ({ value: item.olson_name, label: item.description }))}
                  />
                </Form.Item>
                <Form.Item className={'mb0'} name={'weeks'}>
                  <Weeks />
                </Form.Item>
              </div>
            </SCard>
          </SRender>
        </Flex>
      </Form>
    </Page>
  )
}
