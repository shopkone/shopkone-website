import { Card, Flex } from 'antd'

import VariantChanger from '@/pages/product/product/product-change/variants/variant-changer'
import VariantTable from '@/pages/product/product/product-change/variants/variant-table'

export default function Variants () {
  return (
    <Card title={'Variants'}>
      <Flex vertical gap={20}>
        <VariantChanger />
        <VariantTable />
      </Flex>
    </Card>
  )
}
