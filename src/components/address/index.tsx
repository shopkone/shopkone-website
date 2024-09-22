import { Flex, Form, Input } from 'antd'

import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'

export interface AddressProps {
  hasName?: boolean
  hasEmail?: boolean
}

export default function Address (props: AddressProps) {
  const { hasName, hasEmail } = props
  return (
    <div>
      <SRender render={!hasName}>
        <Form.Item label={'Country/region'}>
          <SSelect />
        </Form.Item>
      </SRender>
      <Flex gap={16}>
        <Flex vertical flex={1}>
          <SRender render={hasName}>
            <Form.Item label={'Legal business name'}>
              <Input />
            </Form.Item>
          </SRender>
          <Form.Item label={'Full address'}>
            <Input />
          </Form.Item>
          <Form.Item label={'City'}>
            <Input />
          </Form.Item>
          <Form.Item label={'Phone'}>
            <Flex gap={4}>
              <SSelect style={{ width: 100 }} />
              <Input />
            </Flex>
          </Form.Item>
          <SRender render={hasEmail}>
            <Form.Item label={'Postal code'}>
              <Input />
            </Form.Item>
          </SRender>
        </Flex>
        <Flex vertical flex={1}>
          <SRender render={hasName}>
            <Form.Item label={'Country/region'}>
              <SSelect />
            </Form.Item>
          </SRender>
          <Form.Item label={'Apartment, suite, etc'}>
            <Input />
          </Form.Item>
          <Form.Item label={'Province'}>
            <SSelect className={'fit-width'} />
          </Form.Item>
          <SRender render={hasEmail}>
            <Form.Item label={'Email'}>
              <Input className={'fit-width'} />
            </Form.Item>
          </SRender>
          <SRender render={!hasEmail}>
            <Form.Item label={'Postal code'}>
              <Input />
            </Form.Item>
          </SRender>
        </Flex>
      </Flex>
    </div>
  )
}
