import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRequest } from 'ahooks'
import { Flex, Form, Input } from 'antd'
import * as dayjs from 'dayjs'

import { useLanguageList } from '@/api/base/languages'
import { usePhonePrefix } from '@/api/base/phone-prefix'
import { EMAIL_EXIST_CODE, PHONE_EXIST_CODE } from '@/api/customer/create'
import { CustomerInfoRes } from '@/api/customer/info'
import { customerUpdateBaseApi } from '@/api/customer/update-base'
import PhoneCode from '@/components/address/phone-code'
import SDatePicker from '@/components/s-date-picker'
import { sMessage } from '@/components/s-message'
import SModal from '@/components/s-modal'
import SSelect from '@/components/s-select'
import { UseOpenType } from '@/hooks/useOpen'
import { useManageState } from '@/pages/mange/state'
import { EMAIL_REG } from '@/utils/regular'

export interface CustomerModalProps {
  openInfo: UseOpenType<CustomerInfoRes>
  onFresh: () => void
}

export default function CustomerModal (props: CustomerModalProps) {
  const { openInfo, onFresh } = props
  const { t } = useTranslation('customers', { keyPrefix: 'info' })
  const languages = useLanguageList()
  const phonePrefix = usePhonePrefix()
  const [form] = Form.useForm()
  const storeCountry = useManageState(state => state.shopInfo?.country)
  const update = useRequest(customerUpdateBaseApi, { manual: true })

  const genderOptions = [
    { label: t('未知'), value: 0 },
    { label: t('男'), value: 1 },
    { label: t('女'), value: 2 },
    { label: t('不愿透露'), value: 3 }
  ]

  const onOk = async () => {
    await form.validateFields().catch(err => {
      const msg = err.errorFields?.[0]?.errors?.[0]
      if (msg) {
        sMessage.warning(msg)
      }
      throw new Error(err)
    })
    const values = form.getFieldsValue()
    values.birthday = values.birthday?.unix()
    const ret = await update.runAsync({ ...values, id: openInfo?.data?.id }).catch(res => {
      if (res.code === EMAIL_EXIST_CODE) {
        form.setFields([{ name: 'email', errors: [res.message] }])
      }
      if (res.code === PHONE_EXIST_CODE) {
        form.setFields([{ name: 'phone', errors: [res.message] }])
      }
      return res
    })
    // @ts-expect-error
    if (ret?.code) return
    onFresh()
    openInfo.close()
    sMessage.success(t('更新成功'))
  }

  const checkMustOne = async () => {
    const { email, phone, first_name, last_name } = form.getFieldsValue()
    if (!email && !phone?.num && !first_name && !last_name) {
      const errText = t('名字、姓氏、电子邮件、电话号码，不能同时为空')
      return await Promise.reject(errText)
    } else {
      form.setFields([
        { name: 'email', errors: [] },
        { name: 'phone', errors: [] },
        { name: 'first_name', errors: [] },
        { name: 'last_name', errors: [] }
      ])
    }
  }

  useEffect(() => {
    if (!openInfo.open || !phonePrefix?.data) return
    const country = phonePrefix.data.find(item => item.prefix === openInfo?.data?.phone?.prefix)
    const defaultCountry = openInfo?.data?.address?.[0]?.country || storeCountry
    const defaultPrefix = phonePrefix.data.find(item => item.code === defaultCountry)?.prefix
    const phone = openInfo?.data?.phone?.num
      ? {
          num: openInfo?.data?.phone?.num,
          country: country?.code,
          prefix: country?.prefix
        }
      : {
          num: '',
          country: defaultCountry,
          prefix: defaultPrefix
        }
    form.setFieldsValue({
      ...openInfo.data,
      phone,
      birthday: openInfo?.data?.birthday ? dayjs.unix(openInfo?.data?.birthday) : undefined
    })
  }, [openInfo.open])

  return (
    <SModal
      onOk={onOk}
      confirmLoading={update.loading}
      width={600}
      loading={languages.loading || phonePrefix.loading}
      open={openInfo.open}
      title={t('编辑客户')}
      onCancel={openInfo.close}
    >
      <div style={{ padding: 20 }}>
        <Form layout={'vertical'} form={form}>
          <Flex gap={16}>
            <Form.Item
              rules={[{
                validator: checkMustOne
              }]}
              name={'first_name'}
              className={'flex1'}
              label={t('名字')}
            >
              <Input autoComplete={'off'} />
            </Form.Item>
            <Form.Item
              rules={[{
                validator: checkMustOne
              }]}
              name={'last_name'}
              className={'flex1'}
              label={t('姓氏')}
            >
              <Input autoComplete={'off'} />
            </Form.Item>
          </Flex>
          <Form.Item name={'language'} label={t('语言')}>
            <SSelect
              showSearch
              optionLabelProp={'label'}
              optionFilterProp={'label'}
              options={languages?.data}
            />
          </Form.Item>
          <Flex gap={16}>
            <Form.Item
              className={'fit-width'}
              name={'email'}
              rules={[
                { validator: checkMustOne },
                { pattern: EMAIL_REG, message: t('请输入有效的邮箱') }
              ]}
              label={t('邮箱')}
            >
              <Input autoComplete={'off'} />
            </Form.Item>
            <Form.Item
              rules={[{
                validator: checkMustOne
              }]}
              className={'fit-width'}
              name={'phone'}
              label={t('手机')}
            >
              <PhoneCode />
            </Form.Item>
          </Flex>
          <Flex gap={16}>
            <Form.Item className={'flex1'} label={t('性别')} name={'gender'}>
              <SSelect options={genderOptions} />
            </Form.Item>
            <Form.Item name={'birthday'} className={'flex1'} label={t('生日')}>
              <SDatePicker placeholder={''} />
            </Form.Item>
          </Flex>
        </Form>
      </div>
    </SModal>
  )
}
