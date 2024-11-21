import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Flex, Form, Input } from 'antd'
import cloneDeep from 'lodash/cloneDeep'

import { CustomerCreateApi } from '@/api/customer/create'
import Address from '@/components/address'
import PhoneCode from '@/components/address/phone-code'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SDatePicker from '@/components/s-date-picker'
import { sMessage } from '@/components/s-message'
import SSelect from '@/components/s-select'
import { isEqualHandle } from '@/utils/is-equal-handle'
import { EMAIL_REG } from '@/utils/regular'

export default function CustomerChange () {
  const { t } = useTranslation('customers', { keyPrefix: 'list' })
  const create = useRequest(CustomerCreateApi, { manual: true })
  const [isChange, setIsChange] = useState(false)
  const init = useRef<any>()
  const [form] = Form.useForm()

  const genderOptions = [
    { label: t('未知'), value: 0 },
    { label: t('男'), value: 1 },
    { label: t('女'), value: 2 },
    { label: t('不愿透露'), value: 3 }
  ]

  const onValuesChange = (force?: boolean) => {
    const values = form.getFieldsValue()
    if (!init.current || force === true || !init.current?.address?.phone) {
      init.current = cloneDeep(values)
      return
    }
    const isSame = isEqualHandle(values, init.current)
    setIsChange(!isSame)
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
    const ret = await create.runAsync(values)
    if (ret.id) {
      sMessage.success(t('添加成功'))
    }
  }

  const onReset = () => {
    form.setFieldsValue(init.current)
    setIsChange(false)
  }

  useEffect(() => {
    form.setFieldsValue({ phone: { prefix: 86, country: 'CN', num: '' } })
    onValuesChange(true)
  }, [])

  return (
    <Page
      onOk={onOk}
      isChange={isChange}
      onCancel={onReset}
      loading={create.loading}
      title={t('添加客户')}
      width={950}
      back={'/customers/customers'}
    >
      <Form
        scrollToFirstError={{ behavior: 'instant', block: 'end', focus: true }}
        onValuesChange={onValuesChange}
        form={form}
        layout={'vertical'}
      >
        <Flex gap={16}>
          <Flex gap={16} vertical className={'flex1'}>
            <SCard title={t('基础信息')} className={'fit-width'}>
              <Flex gap={16}>
                <Form.Item className={'fit-width'} name={'first_name'} label={t('名字')}>
                  <Input autoComplete={'off'} />
                </Form.Item>
                <Form.Item name={'last_name'} className={'fit-width'} label={t('姓氏')}>
                  <Input autoComplete={'off'} />
                </Form.Item>
              </Flex>

              <Flex gap={16}>
                <Form.Item
                  className={'fit-width'}
                  name={'email'}
                  label={t('邮箱')}
                  rules={[{ pattern: EMAIL_REG, message: t('请输入有效的邮箱') }]}
                >
                  <Input autoComplete={'off'} />
                </Form.Item>
                <Form.Item name={'phone'} className={'fit-width'} label={t('手机')}>
                  <PhoneCode />
                </Form.Item>
              </Flex>

              <Flex gap={16}>
                <Form.Item className={'fit-width'} name={'gender'} label={t('性别')}>
                  <SSelect options={genderOptions} />
                </Form.Item>
                <Form.Item name={'birthday'} className={'fit-width'} label={t('生日')}>
                  <SDatePicker placeholder={''} />
                </Form.Item>
              </Flex>
            </SCard>

            <Form.Item className={'mb0'} name={'address'}>
              <Address hasName title={t('收货地址')} />
            </Form.Item>
          </Flex>

          <Flex gap={16} vertical style={{ width: 320 }}>
            <SCard className={'fit-width'} title={t('客户')}>
              asd
            </SCard>

            <SCard className={'fit-width'} title={t('备注')}>
              asd
            </SCard>
          </Flex>
        </Flex>
      </Form>
    </Page>
  )
}
