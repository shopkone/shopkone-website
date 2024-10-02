import { useEffect, useRef, useState } from 'react'
import { useMemoizedFn } from 'ahooks'
import { Flex, Form } from 'antd'
import isEqual from 'lodash/isEqual'

import SRender from '@/components/s-render'
import { Options } from '@/pages/mange/product/product/product-change/variants/variant-changer'
import Actions from '@/pages/mange/product/product/product-change/variants/variant-table/actions'
import Filter from '@/pages/mange/product/product/product-change/variants/variant-table/filter'
import Group from '@/pages/mange/product/product/product-change/variants/variant-table/group'
import Table from '@/pages/mange/product/product/product-change/variants/variant-table/table'
import { isEqualHandle } from '@/utils/isEqual'

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
  weight?: number
  compare_at_price?: number
  cost_per_item?: number
  barcode?: string
  inventories: Array<{ id: number, quantity: number, location_id: number }>
  sku?: string
  children?: Variant[]
  parentId?: number
  isParent: boolean
}

export interface VariantTableProps {
  options: Options[]
  isSingle: boolean
  hide?: boolean
  onIsChange: (isChange: boolean) => void
  resetFlag: number
}

export default function VariantTable (props: VariantTableProps) {
  const { options, isSingle, hide, onIsChange, resetFlag } = props
  const [groupName, setGroupName] = useState<string>()
  const [dataSource, setDataSource] = useState<Variant[]>([])
  const form = Form.useFormInstance()
  const initVariants = useRef<Variant[]>([])

  const flat = (v: Variant[]) => {
    const result: Variant[] = []
    if (!v?.length) return []
    v.forEach(item => {
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
    const f = flat(dataSource)
    if (!v?.length) {
      setDataSource([])
      return
    }
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

  const isChange = (variants: Variant[]) => {
    if (!initVariants.current?.length) {
      initVariants.current = variants
    }
    const newVariants = variants.map(item => ({ ...item, id: undefined }))
    const oldVariants = initVariants.current.map(item => ({ ...item, id: undefined }))
    return isEqualHandle(newVariants, oldVariants)
  }

  useEffect(() => {
    const flatData = flat(dataSource)
    const is = isChange(flatData)
    onIsChange(!is)
    form.setFieldValue('variants', flatData)
  }, [dataSource])

  useEffect(() => {
    setDataSource(initVariants.current)
  }, [resetFlag])

  return (
    <div style={{ display: hide ? 'none' : 'block' }} className={styles['variant-table']}>
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
        <Flex gap={12} align={'center'}>
          <Group options={options} hide={!groupName} onChange={setGroupName} value={groupName} />
          <Actions />
        </Flex>
      </Flex>

      <Table
        isSingleVariantType={isSingle}
        groupName={groupName}
        onChange={setDataSource}
        value={dataSource}
      />
    </div>
  )
}
