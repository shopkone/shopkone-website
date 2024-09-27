import { useEffect, useMemo } from 'react'
import { useRequest } from 'ahooks'
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
}

export default function Address (props: AddressProps) {
  const { hasName, hasEmail, loading, value, onChange } = props

  const [form] = Form.useForm()

  const countries = useCountries()
  const phoneCodes = usePhonePrefix()
  const config = useRequest(AddressConfigApi, { manual: true })

  const country = Form.useWatch('country', form)

  const countryOptions = useMemo(() => {
    return countries.data?.map(item => ({ label: item.name, value: item.code }))
  }, [countries.data])

  const zoneOptions = useMemo(() => {
    const c = countries.data?.find(item => item.code === country)
    const options = c?.zones?.map(item => ({ label: item.name, value: item.code }))
    form.setFieldValue('zone', options?.[0]?.value)
    return options || []
  }, [countries.data, country])

  useEffect(() => {
    form.setFieldsValue(value)
  }, [value])

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

  const formatPostalCodeMsg = (msg: string): string => {
    if (!msg) return msg
    return msg.split('').map(item => {
      if (item === '#') return random(0, 9)
      return item
    }).join('')
  }

  const postalCodeRender = (
    <SRender render={!!config?.data?.postal_code}>
      <Form.Item
        validateTrigger={'onBlur'}
        rules={[{
          pattern: new RegExp(config?.data?.postal_code_config?.regex || ''),
          message: `${config?.data?.postal_code || 'Postal code'}  isn't valid.Example:` + formatPostalCodeMsg(config?.data?.postal_code_config?.format || '')
        }]}
        name={'postal_code'}
        label={config?.data?.postal_code}
      >
        <Input
          autoComplete={'off'}
        />
      </Form.Item>
    </SRender>
  )

  useEffect(() => {
    if (!country) return
    config.run({ country })
  }, [country])

  return (
    <SCard loading={loading || countries.loading || phoneCodes.loading || config.loading} title={'Address'}>
      <Form layout={'vertical'} form={form} onValuesChange={(_, values) => onChange?.(values as AddressType)}>
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
