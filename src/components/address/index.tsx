import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'ahooks'
import { Col, Form, FormInstance, Input, Row } from 'antd'
import random from 'lodash/random'

import { useCountries } from '@/api/base/countries'
import { usePhonePrefix } from '@/api/base/phone-prefix'
import { AddressType } from '@/api/common/address'
import PhoneCode from '@/components/address/phone-code'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'

export interface AddressProps {
  requiredName?: boolean
  companyNameLabel?: string
  hasEmail?: boolean
  hasName?: boolean
  loading?: boolean
  value?: AddressType
  onChange?: (value: AddressType) => void
  hiddenTitle?: boolean
  getFormInstance?: (v: FormInstance) => void
  title?: string
  companyNotFirst?: boolean
  borderless?: boolean
  firstName?: boolean
}

const INIT_DATA = {
  id: 0,
  legal_business_name: '',
  address1: '',
  address2: '',
  city: '',
  company: '',
  country: '',
  first_name: '',
  last_name: '',
  postal_code: '',
  zone: ''
}

export default function Address (props: AddressProps) {
  const {
    companyNameLabel,
    hasEmail,
    loading,
    value,
    title,
    borderless,
    onChange,
    hasName,
    hiddenTitle,
    getFormInstance,
    companyNotFirst,
    firstName
  } = props
  const { t } = useTranslation('common', { keyPrefix: 'address' })

  const [form] = Form.useForm()

  const countries = useCountries()
  const phoneCodes = usePhonePrefix()
  const initValues = useRef<AddressType>()

  const country = Form.useWatch('country', form)

  const countryOptions = useMemo(() => {
    return countries.data?.map(item => ({ label: item.name, value: item.code }))
  }, [countries.data])

  const onChangeHandler = () => {
    const v = { id: initValues?.current?.id, ...form.getFieldsValue() }
    onChange?.(v)
  }

  const c = countries.data?.find(item => item.code === country) || countries.data?.find(i => i.code === 'US')
  const zoneOptions = useMemo(() => {
    const options = c?.zones?.map(item => ({ label: item.name, value: item.code }))
    if (options?.length && country) {
      form.setFieldValue('zone', options?.[0]?.value)
      onChangeHandler()
    } else if (options?.length === 0) {
      form.setFieldValue('zone', '')
      onChangeHandler()
    }
    return options || []
  }, [countries.data, country])

  const cardLoading = useDebounce(loading || countries.loading || phoneCodes.loading, { wait: 60 })

  useEffect(() => {
    if (!initValues.current) {
      initValues.current = value
    }
    form.setFieldsValue(value)
  }, [value])

  useEffect(() => {
    if (!phoneCodes.data || !country) return
    if (country && !form.getFieldValue('phone')?.prefix) {
      const code = phoneCodes.data?.find(item => item.code === country)
      form.setFieldValue('phone', { country: code?.code || '', num: '', prefix: code?.prefix || '' })
      onChangeHandler()
    }
  }, [country, phoneCodes.data])

  useEffect(() => {
    getFormInstance?.(form)
  }, [form])

  const countryRender = (
    <Form.Item
      rules={[{ required: true, message: t('请选择国家') }]}
      name={'country'}
      label={c?.config?.country}
    >
      <SSelect
        virtual={false}
        options={countryOptions}
        showSearch
        optionFilterProp={'label'}
      />
    </Form.Item>
  )

  const PostalCodeMsg = useMemo((): string => {
    const msg = c?.postal_code_config?.format || ''
    if (!msg) return msg
    return msg.split('').map(item => {
      if (item === '#') return random(0, 9)
      return item
    }).join('')
  }, [c?.postal_code_config?.format])

  const postalCodeRender = (
    <Form.Item
      extra={PostalCodeMsg ? t('邮编提示', { code: PostalCodeMsg }) : undefined}
      name={'postal_code'}
      label={c?.config?.postal_code || t('邮政编码')}
    >
      <Input autoComplete={'off'} />
    </Form.Item>
  )

  const companyRender = (
    <SRender render={companyNameLabel}>
      <Col span={24}>
        <Form.Item rules={[{ required: props.requiredName }]} name={'legal_business_name'} label={companyNameLabel}>
          <Input autoComplete={'off'} />
        </Form.Item>
      </Col>
    </SRender>
  )

  const nameRender = (
    <SRender render={hasName}>
      <Col span={12}>
        <Form.Item className={'flex1'} label={c?.config?.first_name} name={'first_name'}>
          <Input autoComplete={'off'} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item className={'flex1'} label={c?.config?.last_name} name={'last_name'}>
          <Input autoComplete={'off'} />
        </Form.Item>
      </Col>
    </SRender>
  )

  return (
    <SCard bordered={!borderless} title={hiddenTitle ? undefined : title || t('地址')} loading={cardLoading}>
      <Form initialValues={INIT_DATA} layout={'vertical'} form={form} onValuesChange={onChangeHandler}>
        <Row gutter={16}>

          {!companyNotFirst && companyRender}

          {firstName ? nameRender : companyRender}

          {firstName
            ? (
              <Col span={24}>
                <Form.Item className={'fit-width'} name={'phone'} label={c?.config?.phone}>
                  <PhoneCode />
                </Form.Item>
              </Col>
              )
            : null}

          <Col span={24}>
            {countryRender}
          </Col>

          <Col span={24}>
            <Form.Item name={'address1'} label={c?.config?.address1}>
              <Input autoComplete={'off'} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name={'address2'} label={c?.config?.address2}>
              <Input autoComplete={'off'} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item className={'flex1'} name={'city'} label={c?.config?.city}>
              <Input rootClassName={'fit-width'} autoComplete={'off'} />
            </Form.Item>
          </Col>
          <SRender render={!!zoneOptions?.length && country}>
            <Col span={12}>
              <Form.Item className={'flex1'} name={'zone'} label={c?.config?.zone}>
                <SSelect
                  showSearch
                  optionFilterProp={'label'}
                  options={zoneOptions}
                  className={'fit-width'}
                />
              </Form.Item>
            </Col>
          </SRender>
          <Col span={(hasName && !!zoneOptions?.length) ? 24 : 12}>
            {postalCodeRender}
          </Col>

          {!firstName ? nameRender : null}

          {companyNotFirst ? companyRender : null}

          <SRender render={hasEmail}>
            <Col span={12}>
              <Form.Item className={'flex1'} name={'email'} label={t('邮箱')}>
                <Input autoComplete={'off'} />
              </Form.Item>
            </Col>
          </SRender>

          {
            !firstName
              ? (
                <Col span={12}>
                  <Form.Item className={'flex1'} name={'phone'} label={c?.config?.phone}>
                    <PhoneCode />
                  </Form.Item>
                </Col>
                )
              : null
          }
        </Row>
      </Form>
    </SCard>
  )
}
