import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { IconPlus } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Form, Input, Switch } from 'antd'
import cloneDeep from 'lodash/cloneDeep'

import { useCountries } from '@/api/base/countries'
import { useCurrencyList } from '@/api/base/currency-list'
import { LocalDeliveryInfoApi } from '@/api/localDelivery/info'
import { BaseLocalDeliverArea, LocalDeliveryStatus, UpdateLocalDeliveryApi } from '@/api/localDelivery/update'
import { LocationListApi } from '@/api/location/list'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SLocation from '@/components/s-location'
import { sMessage } from '@/components/s-message'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import Fees from '@/pages/mange/settings/shipping/local-delivery/local-change/fees'
import { isEqualHandle } from '@/utils/is-equal-handle'
import { genId } from '@/utils/random'

import styles from './index.module.less'

export default function LocalChange () {
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const id = Number(useParams().id || 0)
  const locations = useRequest(async () => await LocationListApi({ active: true }))
  const info = useRequest(LocalDeliveryInfoApi, { manual: true })
  const update = useRequest(UpdateLocalDeliveryApi, { manual: true })
  const currentLocation = locations.data?.find(item => info?.data?.location_id === item.id)
  const currencyList = useCurrencyList()
  const countries = useCountries()
  const [form] = Form.useForm()
  const isOpen = Form.useWatch('status', form)
  const [isChange, setIsChange] = useState(false)
  const init = useRef<any>()

  const getItem = () => {
    return {
      id: genId(),
      name: t('本地配送'),
      fees: [{ condition: 0, fee: 0, id: genId() }]
    }
  }

  const onCancel = () => {
    form.setFieldsValue(init.current)
    setIsChange(false)
  }

  const onOk = async () => {
    await form.validateFields().catch(err => {
      const msg = err.errorFields?.[0]?.errors?.[0]
      if (msg) {
        sMessage.warning(msg)
      }
      throw new Error(err)
    })
    const values = form.getFieldsValue()
    const status = values.status ? LocalDeliveryStatus.Open : LocalDeliveryStatus.Close
    values.areas = values.areas?.map((item: BaseLocalDeliverArea) => ({
      ...item,
      fees: item?.fees?.map((fee) => ({ ...fee, condition: fee.condition || 0, fee: fee.fee || 0 }))
    }))
    const areas = values?.status ? values.areas : []
    await update.runAsync({
      id: Number(id),
      ...values,
      areas,
      status
    })
    sMessage.success(t('本地配送更新成功'))
    info.refresh()
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

  useEffect(() => {
    if (!id) return
    info.run({ id })
  }, [id])

  useEffect(() => {
    if (!info.data) return
    form.setFieldsValue({
      ...info.data,
      status: info.data.status === LocalDeliveryStatus.Open
    })
    onValuesChange(true)
  }, [info.data])

  useEffect(() => {
    if (!isOpen) return
    if (!info.data?.areas?.length && info?.data?.id && init.current) {
      form.setFieldValue('areas', [getItem()])
      form.setFieldValue('currency_code', 'USD')
      onValuesChange()
    }
  }, [isOpen])

  return (
    <Page
      onOk={onOk}
      onCancel={onCancel}
      isChange={isChange}
      loading={locations.loading || currencyList.loading || countries.loading || info.loading}
      width={700}
      back={'/settings/shipping/local-delivery'} title={t('编辑本地配送')}
      bottom={64}
    >
      <Form onValuesChange={onValuesChange} form={form} layout={'vertical'}>
        <Flex style={{ minHeight: 400 }} vertical gap={16}>
          <SRender render={currentLocation?.id}>
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
          </SRender>

          <SRender render={isOpen}>
            <SCard title={t('计费货币')}>
              <Form.Item name={'currency_code'}>
                <SSelect
                  listHeight={400}
                  showSearch
                  optionFilterProp={'label'}
                  options={currencyList.data?.map(item => ({ value: item.code, label: item.title }))}
                  style={{ width: 'calc(50% - 16px)' }}
                />
              </Form.Item>
            </SCard>

            <SCard title={t('设置配送区域')}>
              <Form.List name={'areas'}>
                {
                    (fields, { add, remove }) => (
                      <div>
                        {
                          fields.map(({ name }) => (
                            <div key={name}>
                              <Flex align={'center'} justify={'space-between'} className={styles.title}>
                                <div style={{ marginLeft: 4 }}>{t('配送区域x', { x: fields.length === 1 ? '' : name + 1 })}</div>
                                <SRender render={fields.length > 1}>
                                  <Button onClick={() => { remove(name) }} danger size={'small'} type={'link'}>{t('删除')}</Button>
                                </SRender>
                              </Flex>
                              <div className={styles.inner}>
                                <Form.Item
                                  extra={t('该名称不会展示给客户查看')}
                                  rules={[{ required: true }]}
                                  required={false}
                                  label={t('区域名称')}
                                  name={[name, 'name']}
                                >
                                  <Input autoComplete={'off'} />
                                </Form.Item>
                                <Form.Item
                                  rules={[{ required: true, message: t('请填写至少1个邮件编码') }]}
                                  required={false}
                                  extra={t('邮政编码提示')} label={t('邮政编码')} name={[name, 'postal_code']}
                                >
                                  <Input.TextArea autoSize={{ minRows: 5 }} />
                                </Form.Item>
                                <Form.Item label={t('配送信息')} name={[name, 'note']}>
                                  <Input.TextArea placeholder={t('将在结账页面和订单确认通知中显示')} autoSize={{ minRows: 3, maxRows: 3 }} />
                                </Form.Item>
                                <Fees name={name} />
                              </div>
                              <SRender render={name !== 4}>
                                <div className={'line'} />
                              </SRender>
                            </div>
                          ))
                        }
                        <SRender render={fields.length < 5}>
                          <Button
                            onClick={() => {
                              add(getItem())
                              setTimeout(() => {
                                document.getElementById('shopkone-main')?.scrollTo({ left: 0, top: fields.length * 2000, behavior: 'smooth' })
                              })
                            }}
                          >
                            <IconPlus size={13} />
                            {t('添加配送区域')}
                          </Button>
                        </SRender>
                      </div>
                    )
                  }
              </Form.List>
            </SCard>
          </SRender>
        </Flex>
      </Form>
    </Page>
  )
}
