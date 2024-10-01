import { useState } from 'react'
import { Card, Flex, Form } from 'antd'

import { VariantType } from '@/constant/product'
import VariantChanger, { Options } from '@/pages/mange/product/product/product-change/variants/variant-changer'
import VariantTable from '@/pages/mange/product/product/product-change/variants/variant-table'

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
        <VariantTable hide={!options.length && !isSingle} isSingle={isSingle} options={options} />
      </Flex>
    </Card>
  )
}
