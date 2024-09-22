import { Flex, Form, Input } from 'antd'

import PhoneCode from '@/components/address/phone-code'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'

export interface AddressProps {
  hasName?: boolean
  hasEmail?: boolean
  loading?: boolean
}

export default function Address (props: AddressProps) {
  const { hasName, hasEmail, loading } = props

  return (
    <SCard loading={loading} title={'Address'}>
      <SRender render={!hasName}>
        <Form.Item name={'country_iso_3'} label={'Country/region'}>
          <SSelect />
        </Form.Item>
      </SRender>
      <Flex gap={16}>
        <Flex vertical flex={1}>
          <SRender render={hasName}>
            <Form.Item name={'legal_business_name'} label={'Legal business name'}>
              <Input />
            </Form.Item>
          </SRender>
          <Form.Item name={'full_address'} label={'Full address'}>
            <Input />
          </Form.Item>
          <Form.Item name={'city'} label={'City'}>
            <Input />
          </Form.Item>
          <Form.Item name={'phone'} label={'Phone'}>
            <PhoneCode />
          </Form.Item>
          <SRender render={hasEmail}>
            <Form.Item name={'postal_code'} label={'Postal code'}>
              <Input />
            </Form.Item>
          </SRender>
        </Flex>
        <Flex vertical flex={1}>
          <SRender render={hasName}>
            <Form.Item name={'country_iso_3'} label={'Country/region'}>
              <SSelect />
            </Form.Item>
          </SRender>
          <Form.Item name={'apartment'} label={'Apartment, suite, etc'}>
            <Input />
          </Form.Item>
          <Form.Item name={'province_code'} label={'Province'}>
            <SSelect className={'fit-width'} />
          </Form.Item>
          <SRender render={hasEmail}>
            <Form.Item name={'email'} label={'Email'}>
              <Input className={'fit-width'} />
            </Form.Item>
          </SRender>
          <SRender render={!hasEmail}>
            <Form.Item name={'postal_code'} label={'Postal code'}>
              <Input />
            </Form.Item>
          </SRender>
        </Flex>
      </Flex>
    </SCard>
  )
}
