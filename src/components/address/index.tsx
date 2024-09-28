import { useEffect, useMemo, useRef } from 'react'
import { useDebounce, useRequest } from 'ahooks'
import { Flex, Form, Input } from 'antd'
import random from 'lodash/random'

import { AddressConfigApi } from '@/api/base/address-config'
import { useCountries } from '@/api/base/countries'
import { usePhonePrefix } from '@/api/base/phone-prefix'
import { AddressType } from '@/api/common/address'
import PhoneCode from '@/components/address/phone-code'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'

export interface AddressProps {
  hasName?: boolean
  hasEmail?: boolean
  loading?: boolean
  value?: AddressType
  onChange?: (value: AddressType) => void
  onMessage?: (msg?: string) => void
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
  const { hasName, hasEmail, loading, value, onChange } = props

  const [form] = Form.useForm()

  const countries = useCountries()
  const phoneCodes = usePhonePrefix()
  const config = useRequest(AddressConfigApi, { manual: true })
  const initValues = useRef<AddressType>()

  const country = Form.useWatch('country', form)

  const countryOptions = useMemo(() => {
    return countries.data?.map(item => ({ label: item.name, value: item.code }))
  }, [countries.data])

  const onChangeHandler = () => {
    setTimeout(() => {
      const errMsg = form.getFieldsError()?.find(item => item.errors?.length)?.errors?.[0]
      props?.onMessage?.(errMsg)
    })
    onChange?.({ ...(initValues.current || {}), ...form.getFieldsValue() })
  }

  const zoneOptions = useMemo(() => {
    const c = countries.data?.find(item => item.code === country)
    const options = c?.zones?.map(item => ({ label: item.name, value: item.code }))
    const hasZone = form.getFieldValue('zone')
    if (!hasZone && options?.length) {
      form.setFieldValue('zone', options?.[0]?.value)
      onChangeHandler()
    }
    return options || []
  }, [countries.data, country])

  const cardLoading = useDebounce(loading || countries.loading || phoneCodes.loading || config.loading, { wait: 60 })

  useEffect(() => {
    if (!initValues.current) {
      initValues.current = value
    }
    form.setFieldsValue(value)
  }, [value])

  useEffect(() => {
    if (!phoneCodes.data || !country) return
    if (country && !form.getFieldValue('phone')) {
      const code = phoneCodes.data?.find(item => item.code === country)
      form.setFieldValue('phone', { country: code?.code || '', num: '', prefix: code?.prefix || '' })
      onChangeHandler()
    }
  }, [country, phoneCodes.data])

  const countryRender = (
    <Form.Item name={'country'} label={config?.data?.country}>
      <SSelect
        virtual={false}
        options={countryOptions}
        showSearch
        optionFilterProp={'label'}
      />
    </Form.Item>
  )

  const PostalCodeMsg = useMemo((): string => {
    const msg = config?.data?.postal_code_config?.format || ''
    if (!msg) return msg
    return msg.split('').map(item => {
      if (item === '#') return random(0, 9)
      return item
    }).join('')
  }, [config?.data?.postal_code_config?.format])

  const postalCodeRender = (
    <Form.Item
      rules={[{
        pattern: new RegExp(config?.data?.postal_code_config?.regex || ''),
        message: `${config?.data?.postal_code || 'Postal code'}  isn't valid.Example:` + PostalCodeMsg
      }]}
      name={'postal_code'}
      label={config?.data?.postal_code || 'Postal code'}
    >
      <Input autoComplete={'off'} />
    </Form.Item>
  )

  useEffect(() => {
    if (!country) return
    config.run({ country })
  }, [country])

  return (
    <SCard loading={cardLoading} title={'Address'}>
      <Form initialValues={INIT_DATA} layout={'vertical'} form={form} onValuesChange={onChangeHandler}>
        <SRender render={!hasName}>{countryRender}</SRender>
        <Flex gap={16}>
          <Flex vertical flex={1}>
            <SRender render={hasName}>
              <Form.Item name={'legal_business_name'} label={'Legal business name'}>
                <Input autoComplete={'off'} />
              </Form.Item>
            </SRender>
            <Form.Item name={'address1'} label={config?.data?.address1}>
              <Input autoComplete={'off'} />
            </Form.Item>
            <Form.Item name={'city'} label={config?.data?.city}>
              <Input autoComplete={'off'} />
            </Form.Item>
            <Form.Item name={'phone'} label={config?.data?.phone}>
              <PhoneCode />
            </Form.Item>
            <SRender render={hasEmail}>{postalCodeRender}</SRender>
          </Flex>
          <Flex vertical flex={1}>
            <SRender render={hasName}>{countryRender}</SRender>
            <Form.Item name={'address2'} label={config?.data?.address2}>
              <Input autoComplete={'off'} />
            </Form.Item>
            <SRender render={!!zoneOptions?.length}>
              <Form.Item name={'zone'} label={config?.data?.zone}>
                <SSelect
                  showSearch
                  optionFilterProp={'label'}
                  options={zoneOptions}
                  className={'fit-width'}
                />
              </Form.Item>
            </SRender>
            <SRender render={hasEmail}>
              <Form.Item name={'email'} label={'Email'}>
                <Input autoComplete={'off'} />
              </Form.Item>
            </SRender>
            <SRender render={!hasEmail}>{postalCodeRender}</SRender>
          </Flex>
        </Flex>
      </Form>
    </SCard>
  )
}
