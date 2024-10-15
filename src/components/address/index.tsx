import { useEffect, useMemo, useRef } from 'react'
import { useDebounce } from 'ahooks'
import { Flex, Form, Input } from 'antd'
import random from 'lodash/random'

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
  hasUserName?: boolean
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
  const { hasName, hasEmail, loading, value, onChange, hasUserName } = props

  const [form] = Form.useForm()

  const countries = useCountries()
  const phoneCodes = usePhonePrefix()
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

  const c = countries.data?.find(item => item.code === country)
  const zoneOptions = useMemo(() => {
    const options = c?.zones?.map(item => ({ label: item.name, value: item.code }))
    const hasZone = form.getFieldValue('zone')
    if (!hasZone && options?.length) {
      form.setFieldValue('zone', options?.[0]?.value)
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
    if (country && !form.getFieldValue('phone')) {
      const code = phoneCodes.data?.find(item => item.code === country)
      form.setFieldValue('phone', { country: code?.code || '', num: '', prefix: code?.prefix || '' })
      onChangeHandler()
    }
  }, [country, phoneCodes.data])

  const countryRender = (
    <Form.Item name={'country'} label={c?.config?.country}>
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
      rules={[{
        pattern: new RegExp(c?.postal_code_config?.regex || ''),
        message: `${c?.config?.postal_code || 'Postal code'}  isn't valid.Example:` + PostalCodeMsg
      }]}
      name={'postal_code'}
      label={c?.config?.postal_code || 'Postal code'}
    >
      <Input autoComplete={'off'} />
    </Form.Item>
  )

  return (
    <SCard title={'Address'} loading={cardLoading}>
      <Form initialValues={INIT_DATA} layout={'vertical'} form={form} onValuesChange={onChangeHandler}>
        <Flex vertical flex={1}>
          <SRender render={hasName}>
            <Form.Item name={'legal_business_name'} label={'Legal business name'}>
              <Input autoComplete={'off'} />
            </Form.Item>
          </SRender>
          {countryRender}
          <Form.Item name={'address1'} label={c?.config?.address1}>
            <Input autoComplete={'off'} />
          </Form.Item>
          <Form.Item name={'address2'} label={c?.config?.address2}>
            <Input autoComplete={'off'} />
          </Form.Item>
          <Flex gap={16}>
            <Form.Item className={'flex1'} name={'city'} label={c?.config?.city}>
              <Input rootClassName={'fit-width'} autoComplete={'off'} />
            </Form.Item>
            <SRender render={!!zoneOptions?.length}>
              <Form.Item className={'flex1'} name={'zone'} label={c?.config?.zone}>
                <SSelect
                  showSearch
                  optionFilterProp={'label'}
                  options={zoneOptions}
                  className={'fit-width'}
                />
              </Form.Item>
            </SRender>
          </Flex>
          {postalCodeRender}
          <SRender render={hasUserName}>
            <Flex gap={16} align={'center'}>
              <Form.Item className={'flex1'} label={c?.config?.first_name} name={'first_name'}>
                <Input autoComplete={'off'} />
              </Form.Item>
              <Form.Item className={'flex1'} label={c?.config?.last_name} name={'last_name'}>
                <Input autoComplete={'off'} />
              </Form.Item>
            </Flex>
          </SRender>

          <Flex align={'center'} gap={16}>
            <SRender render={hasEmail}>
              <Form.Item className={'flex1'} name={'email'} label={'Email'}>
                <Input autoComplete={'off'} />
              </Form.Item>
            </SRender>
            <Form.Item className={'flex1'} name={'phone'} label={c?.config?.phone}>
              <PhoneCode />
            </Form.Item>
          </Flex>
        </Flex>
      </Form>
    </SCard>
  )
}
