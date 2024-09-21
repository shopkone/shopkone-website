import { Flex, Form, Input } from 'antd'

import SSelect from '@/components/s-select'

export default function Address () {
  return (
    <Flex gap={16}>
      <Flex vertical flex={1}>
        <Form.Item label={'Legal business name'}>
          <Input />
        </Form.Item>
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
        <Form.Item label={'Postal code'}>
          <Input />
        </Form.Item>
      </Flex>
      <Flex vertical flex={1}>
        <Form.Item label={'Country/region'}>
          <SSelect />
        </Form.Item>
        <Form.Item label={'Apartment, suite, etc'}>
          <Input />
        </Form.Item>
        <Form.Item label={'Province'}>
          <SSelect className={'fit-width'} />
        </Form.Item>
        <Form.Item label={'Email'}>
          <Input className={'fit-width'} />
        </Form.Item>
      </Flex>
    </Flex>
  )
}
