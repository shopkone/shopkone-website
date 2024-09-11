import { Card, Flex, Form, Select } from 'antd'

import BaseInfo from '@/pages/product/product/product-change/base-info'
import Insights from '@/pages/product/product/product-change/Insights'
import ProductOrganization from '@/pages/product/product/product-change/product-organization'
import Publishing from '@/pages/product/product/product-change/publishing'
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
          <Card title={'Status'} style={{ width: '100%' }}>
            <Select style={{ width: '100%' }} />
          </Card>
          <Publishing />
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
