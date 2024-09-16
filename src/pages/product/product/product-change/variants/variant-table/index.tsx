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

import styles from './index.module.less'

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
  barcode?: string
  sku?: string
  children?: Variant[]
  parentId?: number
  isParent: boolean
}

export interface VariantTableProps {
  options: Options[]
  isSingle: boolean
}

export default function VariantTable (props: VariantTableProps) {
  const { options, isSingle } = props
  const [groupName, setGroupName] = useState<string>()
  const [dataSource, setDataSource] = useState<Variant[]>([])

  const flat = () => {
    const result: Variant[] = []
    dataSource.forEach(item => {
      if (item.children?.length) {
        result.push({ ...item, children: [] })
        item.children.forEach(i => {
          result.push({ ...i })
        })
      } else {
        result.push(item)
      }
    })
    return result
  }

  const onChangeDataSource = useMemoizedFn((v: Variant[]) => {
    const f = flat()
    const list = v.map(item => {
      const children = item.children?.map(i => {
        const find = f.find(j => isEqual(i.name, j.name))
        return find || i
      })
      if (children?.length) {
        const find = f.find(i => isEqual(i.name, item.name) && i.isParent)
        return find ? { ...find, children } : { ...item, children }
      }
      const find = f.find(i => isEqual(item.name, i.name))
      return find ? { ...find, children } : { ...item, children }
    })
    setDataSource(list)
  })

  return (
    <div className={styles['variant-table']}>
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

      <Table groupName={groupName} onChange={setDataSource} value={dataSource} />
    </div>
  )
}
