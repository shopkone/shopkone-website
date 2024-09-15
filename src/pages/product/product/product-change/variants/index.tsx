import { useState } from 'react'
import { Card, Flex, Form } from 'antd'
import { useAtomValue } from 'jotai'

import SRender from '@/components/s-render'
import { VariantType } from '@/constant/product'
import { expandAtom } from '@/pages/product/product/product-change/variants/state'
import VariantChanger, { Options } from '@/pages/product/product/product-change/variants/variant-changer'
import VariantTable from '@/pages/product/product/product-change/variants/variant-table'

export default function Variants () {
  const [options, setOptions] = useState<Options[]>([])
  const form = Form.useFormInstance()
  const variantType: VariantType = Form.useWatch('variant_type', form)
  const isSingle = variantType !== VariantType.Multiple
  const expand = useAtomValue(expandAtom)

  return (
    <Card style={{ maxWidth: expand ? 950 : 620, transition: 'all 0.1s ease-in-out' }} title={'Variants'}>
      <Flex vertical gap={24}>
        <VariantChanger onChange={setOptions} />
        <SRender render={!!options.length || isSingle}>
          <VariantTable isSingle={isSingle} options={options} />
        </SRender>
      </Flex>
    </Card>
  )
}
