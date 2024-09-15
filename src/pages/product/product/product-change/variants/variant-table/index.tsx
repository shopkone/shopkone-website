import { useState } from 'react'
import { useMemoizedFn } from 'ahooks'
import { Flex } from 'antd'
import { isEqual } from 'lodash'

import SRender from '@/components/s-render'
import { Options } from '@/pages/product/product/product-change/variants/variant-changer'
import Actions from '@/pages/product/product/product-change/variants/variant-table/actions'
import Filter from '@/pages/product/product/product-change/variants/variant-table/filter'
import Group from '@/pages/product/product/product-change/variants/variant-table/group'
import Table from '@/pages/product/product/product-change/variants/variant-table/table'

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
  parentId?: number
}

export interface VariantTableProps {
  options: Options[]
  isSingle: boolean
}

export default function VariantTable (props: VariantTableProps) {
  const { options, isSingle } = props
  const [groupName, setGroupName] = useState<string>()
  const [dataSource, setDataSource] = useState<Variant[]>([])

  const flat = (variants: Variant[]) => {
    const result: Variant[] = []
    variants.forEach(item => {
      if (item.children?.length) {
        item.children.forEach(i => {
          result.push({ ...i, children: [] })
        })
      } else {
        result.push(item)
      }
    })
    return result
  }

  const onChangeDataSource = useMemoizedFn((v: Variant[]) => {
    if (!dataSource?.length) {
      setDataSource(v)
      return
    }
    const oldList = flat(dataSource)
    const list = v.map(item => {
      const children = item.children?.map(i => {
        const find = oldList.find(ii => isEqual(ii.name, i.name))
        if (find) return find
        return i
      })
      const find = oldList.find(i => isEqual(i.name, item.name))
      if (find) return { ...find, children }
      return { ...item, children }
    })
    console.log(list)
    setDataSource(list)
  })

  return (
    <div style={{ height: dataSource?.length ? undefined : 0, overflow: 'hidden' }}>
      <Flex style={{ marginBottom: dataSource?.length ? 12 : 0 }} justify={'space-between'}>
        <Group options={options} hide={!groupName} onChange={setGroupName} value={groupName} />
        <Actions hide={!groupName} />
      </Flex>

      <Flex align={'center'} style={{ marginBottom: 12 }} justify={'space-between'}>
        <SRender className={'tips'} style={{ fontSize: 13 }} render={isSingle}>
          Single Variant Mode
        </SRender>
        <Filter
          isSingleVariantType={isSingle}
          options={options}
          groupName={groupName}
          onChange={onChangeDataSource}
        />
        <Actions hide={!dataSource?.length || !!groupName} />
      </Flex>

      <Table onChange={setDataSource} value={dataSource} />
    </div>
  )
}
