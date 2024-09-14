import { useState } from 'react'
import { Flex, Form } from 'antd'

import SRender from '@/components/s-render'
import { VariantType } from '@/constant/product'
import { Options } from '@/pages/product/product/product-change/variants/variant-changer'
import Actions from '@/pages/product/product/product-change/variants/variant-table/actions'
import Filter from '@/pages/product/product/product-change/variants/variant-table/filter'
import Group from '@/pages/product/product/product-change/variants/variant-table/group'

export interface VariantName {
  id: number
  label: string
  value: string
}

export interface Variant {
  id: number
  name: VariantName[]
  price: number
  weight_uint: 'kg' | 'lb' | 'oz' | 'g'
  compare_at_price?: number
  cost_per_item?: number
  children?: Variant[]
  isChild?: boolean
  isParent?: boolean
}

export interface VariantTableProps {
  options: Options[]
}

export default function VariantTable (props: VariantTableProps) {
  const { options } = props
  const [groupName, setGroupName] = useState<string>()
  const form = Form.useFormInstance()
  const variantType: VariantType = Form.useWatch('variant_type', form)
  const isSingleVariant = variantType === VariantType.Single
  const [dataSource, setDataSource] = useState<Variant[]>([])

  return (
    <div>
      <Flex style={{ marginBottom: dataSource?.length ? 12 : 0 }} justify={'space-between'}>
        <Group options={options} hide={!dataSource?.length} onChange={setGroupName} value={groupName} />
        <Actions hide={!dataSource?.length} />
      </Flex>

      <Flex style={{ marginBottom: 12 }} justify={'space-between'}>
        <SRender className={'tips'} style={{ fontSize: 13 }} render={isSingleVariant}>
          Single Variant Mode
        </SRender>
        <Filter options={options} groupName={groupName} onChange={setDataSource} />
        <Actions hide={!dataSource?.length || !!groupName} />
      </Flex>

      {/* <STable columns={columns} data={dataSource} /> */}
      {/* <Table /> */}
    </div>
  )
}
