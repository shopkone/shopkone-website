import { useState } from 'react'
import { Card, Flex, Form } from 'antd'

import { VariantType } from '@/constant/product'
import VariantChanger, { Options } from '@/pages/mange/product/product/product-change/variants/variant-changer'
import VariantTable, { Variant } from '@/pages/mange/product/product/product-change/variants/variant-table'

import styles from './index.module.less'

export interface VariantsProps {
  onIsChange: (isChange: boolean) => void
  resetFlag: number
  remoteVariants: Variant[]
  remoteOptions: Options[]
}

export default function Variants (props: VariantsProps) {
  const { onIsChange, resetFlag, remoteVariants, remoteOptions } = props
  const [options, setOptions] = useState<Options[]>([])
  const form = Form.useFormInstance()
  const variantType: VariantType = Form.useWatch('variant_type', form)
  const isSingle = variantType !== VariantType.Multiple

  return (
    <Card bordered className={styles.container} title={'Variants'}>
      <Flex vertical gap={24}>
        <VariantChanger remoteOptions={remoteOptions} onChange={setOptions} />
        <VariantTable
          remoteVariants={remoteVariants}
          resetFlag={resetFlag}
          onIsChange={onIsChange}
          hide={!options.length && !isSingle}
          isSingle={isSingle}
          options={options}
        />
      </Flex>
    </Card>
  )
}
