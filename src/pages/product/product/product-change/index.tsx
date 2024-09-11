import { DoubleLeft, DoubleRight, Left, Right } from '@icon-park/react'
import { Card, DatePicker, Flex, Form, Select } from 'antd'
import dayjs from 'dayjs'

import BaseInfo from '@/pages/product/product/product-change/base-info'
import Insights from '@/pages/product/product/product-change/Insights'
import ProductOrganization from '@/pages/product/product/product-change/product-organization'
import Variants from '@/pages/product/product/product-change/variants'
import VariantsSettings from '@/pages/product/product/product-change/variants-settings'

export default function ProductChange () {
  return (
    <Form layout={'vertical'}>
      <Flex gap={16} style={{ width: 950, margin: '24px auto' }}>
        <Flex vertical gap={16} flex={1}>
          <BaseInfo />
          <VariantsSettings />
          <Variants />
        </Flex>
        <Flex vertical style={{ width: 320 }} gap={16}>
          <Card style={{ width: '100%' }}>
            <Form.Item label={'Status'}>
              <Select style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label={'Schedule availability'}>
              <DatePicker
                inputReadOnly
                prevIcon={<Left style={{ fontSize: 16 }} />}
                nextIcon={<Right style={{ fontSize: 16 }} />}
                superPrevIcon={<DoubleLeft style={{ fontSize: 16 }} />}
                superNextIcon={<DoubleRight style={{ fontSize: 16 }} />}
                hideDisabledOptions
                minuteStep={30}
                allowClear={false}
                suffixIcon={false}
                minDate={dayjs()}
                showTime={{ format: 'HH:mm' }}
                showSecond={false}
                className={'fit-width'}
              />
            </Form.Item>
          </Card>
          <Insights />
          <ProductOrganization />
          <Card title={'Theme template'}>
            <Select style={{ width: '100%' }} />
          </Card>
        </Flex>
      </Flex>
    </Form>
  )
}
