import { useState } from 'react'
import { Card, Flex, Form } from 'antd'

import SRender from '@/components/s-render'
import { VariantType } from '@/constant/product'
import VariantChanger, { Options } from '@/pages/product/product/product-change/variants/variant-changer'
import VariantTable from '@/pages/product/product/product-change/variants/variant-table'

import styles from './index.module.less'

export default function Variants () {
  const [options, setOptions] = useState<Options[]>([])
  const form = Form.useFormInstance()
  const variantType: VariantType = Form.useWatch('variant_type', form)
  const isSingle = variantType !== VariantType.Multiple

  return (
    <Card bordered className={styles.container} title={'Variants'}>
      <Flex vertical gap={24}>
        <VariantChanger onChange={setOptions} />
        <SRender render={!!options.length || isSingle}>
          <VariantTable isSingle={isSingle} options={options} />
        </SRender>
      </Flex>
    </Card>
  )
}
