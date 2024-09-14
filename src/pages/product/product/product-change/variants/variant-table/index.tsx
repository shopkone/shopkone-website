import { useState } from 'react'
import { Flex, Form } from 'antd'

import STable from '@/components/s-table'
import { VariantType } from '@/constant/product'
import Actions from '@/pages/product/product/product-change/variants/variant-table/actions'
import Filter from '@/pages/product/product/product-change/variants/variant-table/filter'
import Group from '@/pages/product/product/product-change/variants/variant-table/group'

export default function VariantTable () {
  const [groupName, setGroupName] = useState<string>()
  const form = Form.useFormInstance()
  const variantType: VariantType = Form.useWatch('variant_type', form)
  const isSingleVariant = variantType === VariantType.Single

  const filter = <Filter groupName={groupName} onChange={() => { }} />

  return (
    <div>
      <Flex style={{ marginBottom: 12 }} justify={'space-between'}>
        {
          isSingleVariant
            ? (
              <div className={'tips'} style={{ fontSize: 13 }}>
                Single Variant Mode
              </div>
              )
            : (
                groupName
                  ? (
                    <Group onChange={setGroupName} value={groupName} />
                    )
                  : filter
              )
        }
        <Actions />
      </Flex>
      <Group onChange={setGroupName} value={groupName} />
      {groupName ? filter : null}

      <STable columns={[]} data={[]} />
    </div>
  )
}
