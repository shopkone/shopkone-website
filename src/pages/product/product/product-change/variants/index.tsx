import { useState } from 'react'
import { Card, Flex } from 'antd'

import SRender from '@/components/s-render'
import VariantChanger, { Options } from '@/pages/product/product/product-change/variants/variant-changer'
import VariantTable from '@/pages/product/product/product-change/variants/variant-table'

export default function Variants () {
  const [options, setOptions] = useState<Options[]>([])

  return (
    <Card title={'Variants'}>
      <Flex vertical gap={24}>
        <VariantChanger onChange={setOptions} />
        <SRender render={options.length}>
          <VariantTable options={options} />
        </SRender>
      </Flex>
    </Card>
  )
}
