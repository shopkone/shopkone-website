import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Checkbox, Flex, Form, FormInstance, Input } from 'antd'
import cloneDeep from 'lodash/cloneDeep'

import { useCurrencyList } from '@/api/base/currency-list'
import { useTimezoneList } from '@/api/base/timezone-list'
import { ShopGeneralApi } from '@/api/shop/get-general'
import { UpdateGeneralApi } from '@/api/shop/update-general'
import Address from '@/components/address'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import { sMessage } from '@/components/s-message'
import SSelect from '@/components/s-select'
import Uploader from '@/pages/mange/settings/general/uploader'
import { useManageState } from '@/pages/mange/state'
import { isEqualHandle } from '@/utils/is-equal-handle'
import { EMAIL_REG } from '@/utils/regular'

export default function General () {
  const general = useRequest(ShopGeneralApi)
  const update = useRequest(UpdateGeneralApi, { manual: true })
  const [form] = Form.useForm()
  const timezones = useTimezoneList()
  const currencyList = useCurrencyList()

  const orderIdPrefix = Form.useWatch('order_id_prefix', form)
  const orderIdSuffix = Form.useWatch('order_id_suffix', form)
  const manageState = useManageState()
  const init = useRef<any>()
  const addressForm = useRef<FormInstance>()

  const [isChange, setIsChange] = useState(false)
  const { t } = useTranslation('settings', { keyPrefix: 'general' })

  const formattingOptions = [
    { label: t('例如123,456.78'), value: '123,456.78' },
    { label: t('例如 123,456'), value: '123,456' },
    { label: t('例如 123.456,78'), value: '123.456,78' },
    { label: t('例如 123.456'), value: '123.456' },
    { label: t("例如 123'456.65"), value: '123\'456.65' }
  ]

  const onValuesChange = (force?: boolean) => {
    const values = form.getFieldsValue(true)
    if (!init.current || force === true || !values?.address) {
      init.current = cloneDeep(values)
      return
    }
    const isSame = isEqualHandle(values, init.current)
    setIsChange(!isSame)
  }

  const onCancel = () => {
    form.setFieldsValue(general.data)
    setIsChange(false)
  }

  const onOk = async () => {
    await addressForm.current?.validateFields()
    await form.validateFields()
    const values = form.getFieldsValue()
    await update.runAsync(values)
    await general.refreshAsync()
    await manageState.setShopInfo()
    sMessage.success(t('更新成功'))
    setIsChange(false)
  }

  useEffect(() => {
    if (!general.data) return
    form.setFieldsValue(general.data)
    onValuesChange(true)
  }, [general.data])

  return (
    <Page
      onOk={onOk}
      onCancel={onCancel}
      isChange={isChange}
      title={t('基本设置')}
      width={700}
    >
      <Form onValuesChange={onValuesChange} form={form} layout={'vertical'}>
        <Flex vertical gap={16}>
          <SCard loading={general.loading} title={t('商店信息')}>
            <Flex gap={48}>
              <Flex vertical flex={3}>
                <Form.Item
                  name={'store_name'}
                  className={'flex1'}
                  label={t('商店名称')}
                  rules={[{
                    required: true,
                    message: t('请输入商店名称')
                  }]}
                >
                  <Input autoComplete={'off'} />
                </Form.Item>
                <Form.Item
                  name={'store_owner_email'}
                  extra={t('如果有需要，Shopkimi 会通过此邮箱来联系您。')}
                  className={'flex1'}
                  label={t('店主邮箱')}
                  rules={[{ required: true, message: t('请输入邮箱') },
                    {
                      pattern: EMAIL_REG,
                      message: t('请输入有效的邮箱')
                    }]}
                >
                  <Input autoComplete={'off'} />
                </Form.Item>
                <Form.Item
                  rules={[{ required: true, message: t('请输入邮箱') },
                    {
                      pattern: EMAIL_REG,
                      message: t('请输入有效的邮箱')
                    }]}
                  name={'customer_service_email'}
                  extra={t('此邮箱将作为商店联系顾客的默认邮箱')}
                  label={t('客服邮箱')}
                >
                  <Input autoComplete={'off'} />
                </Form.Item>
              </Flex>
              <Flex vertical flex={2}>
                <Form.Item label={t('网站图标')} name={'website_favicon_id'}>
                  <Uploader />
                </Form.Item>
              </Flex>
            </Flex>
          </SCard>
          <Form.Item name={'address'}>
            <Address getFormInstance={(v) => { addressForm.current = v }} loading={general.loading} companyNameLabel={t('法定公司名称')} />
          </Form.Item>
          <SCard loading={general.loading || timezones.loading || currencyList.loading} title={t('商店默认设置')}>
            <Flex vertical>
              <Form.Item
                name={'store_currency'}
                extra={t('商店正常运营之后，更改货币将影响您商店的商品价格、订单和数据等信息，请谨慎操作。')} label={t('商店货币')}
              >
                <SSelect
                  listHeight={400}
                  showSearch
                  optionFilterProp={'label'}
                  options={currencyList.data?.map(item => ({ value: item.code, label: item.title }))}
                  style={{ width: 'calc(50% - 16px)' }}
                />
              </Form.Item>
              <Flex flex={1} gap={16}>
                <Form.Item style={{ flexShrink: 0 }} name={'currency_formatting'} className={'flex1'} label={t('货币格式')}>
                  <SSelect options={formattingOptions} />
                </Form.Item>
                <Form.Item style={{ flexShrink: 0 }} className={'flex1'} name={'timezone'} label={t('商店时区')}>
                  <SSelect
                    showSearch
                    optionFilterProp={'label'}
                    options={timezones.data?.map(item => ({ value: item.olson_name, label: item.description }))}
                  />
                </Form.Item>
              </Flex>
            </Flex>
          </SCard>
          <SCard loading={general.loading} title={t('订单 ID')}>
            <div className={'tips'} style={{ marginTop: -4, marginBottom: 12 }}>
              {t('系统自动生成的订单唯一标识，用户侧页面上不会展示。')}
            </div>
            <Form.Item name={'order_id_prefix'} label={t('前缀')}>
              <Input autoComplete={'off'} />
            </Form.Item>
            <Form.Item name={'order_id_suffix'} label={t('后缀')}>
              <Input autoComplete={'off'} />
            </Form.Item>
            <div>{t('您的订单 ID 将显示为')}{orderIdPrefix}1001{orderIdSuffix}, {orderIdPrefix}1002{orderIdSuffix}, {orderIdPrefix}1003{orderIdSuffix}</div>
          </SCard>
          <SCard loading={general.loading} title={t('密码保护')}>
            <div className={'tips'} style={{ marginTop: -8, marginBottom: 12 }}>
              {t('启用密码来限制他人访问你的在线商店，启用密码后，你的商店仅向拥有密码的客户开放。')}
            </div>
            <Form.Item valuePropName={'checked'} name={'password_protection'} style={{ marginBottom: 8, fontWeight: 500 }}>
              <Checkbox>{t('启用')}</Checkbox>
            </Form.Item>
            <Form.Item name={'password'} label={t('密码')}>
              <Input style={{ width: 400 }} />
            </Form.Item>
            <Form.Item name={'password_message'} label={t('访问提示文案')}>
              <Input.TextArea
                autoSize={{ minRows: 5 }}
                style={{ width: 400 }}
              />
            </Form.Item>
          </SCard>
        </Flex>
      </Form>
    </Page>
  )
}
