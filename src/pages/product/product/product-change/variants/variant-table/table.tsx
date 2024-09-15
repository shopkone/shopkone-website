import { useState } from 'react'
import { AddPicture, DeleteFour, Down, Up } from '@icon-park/react'
import { Checkbox, Flex, Input } from 'antd'
import { cloneDeep } from 'lodash'

import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import { Variant } from '@/pages/product/product/product-change/variants/variant-table/index'

import styles from './index.module.less'

export interface TableProps {
  value: Variant[]
  onChange: (value: Variant[]) => void
  groupName?: string
}

export default function Table (props: TableProps) {
  const { value, onChange, groupName } = props
  const [expands, setExpands] = useState<number[]>([])

  const updateFormData = (row: Variant, key: string, v: any) => {
    if (row.children?.length) {
      row.children = row.children?.map((item: Variant) => {
        return { ...item, [key]: v }
      })
    } else {
      // @ts-expect-error
      row[key] = v
    }
    const newValue = value.map((item: Variant) => {
      return item.id === row.id ? row : item
    })
    onChange(cloneDeep(newValue))
  }

  const columns: STableProps['columns'] = [
    {
      title: (
        <span>
          <Checkbox style={{ marginRight: 16, marginLeft: -8 }} />
          Variant
        </span>
      ),
      code: 'id',
      name: 'id',
      render: (id: number, row: Variant) => (
        <div>
          <SRender render={row.isParent}>
            <Flex align={'center'}>
              <Flex align={'center'} justify={'center'} onClick={(e) => { e.stopPropagation() }} className={styles['checkbox-wrap']}>
                <Checkbox />
              </Flex>
              <Flex className={styles['add-img']}>
                <AddPicture fill={'#3471ff'} size={15} style={{ position: 'relative', top: 2 }} />
              </Flex>
              <div>
                <div>{row.name?.[0]?.value}</div>
                <Flex gap={4} className={'tips'} style={{ fontSize: 13 }} align={'center'}>
                  <div>{row?.children?.length} Variants</div>
                  <div className={styles['down-icon']}>
                    {expands?.includes(id) ? (<Up size={14} />) : (<Down size={14} />)}
                  </div>
                </Flex>
              </div>
            </Flex>
          </SRender>

          <SRender render={!row.isParent}>
            <Flex style={{ marginLeft: row.parentId ? 12 : -8 }} align={'center'}>
              <Flex align={'center'}>
                <Checkbox style={{ marginRight: 12 }} />
              </Flex>
              <Flex className={styles['add-img']} style={row.parentId ? { width: 40, height: 40 } : {}}>
                <AddPicture fill={'#3471ff'} size={15} style={{ position: 'relative', top: 2 }} />
              </Flex>
              <div style={{ fontSize: 13 }} className={'tips'}>
                {row.name?.filter(i => i.label !== groupName)?.map(i => i.value)?.join(' / ')}
              </div>
            </Flex>
          </SRender>
        </div>
      ),
      width: 300
    },
    {
      title: 'Price',
      code: 'price',
      name: 'price',
      render: (price: number, row: Variant) => {
        return (
          <SInputNumber
            money
            placeholder={'0.00'}
            value={price}
            onChange={(v) => { updateFormData(row, 'price', v) }}
          />
        )
      },
      width: 120
    },
    {
      title: 'Compare at price',
      name: 'compare_at_price',
      code: 'compare_at_price',
      render: () => (
        <SInputNumber money />
      ),
      width: 150
    },
    {
      title: 'Inventory',
      name: 'inventory',
      code: 'inventory',
      render: () => (
        <SInputNumber uint placeholder={'0'} />
      ),
      width: 120
    },
    {
      title: 'SKU',
      name: 'sku',
      code: 'sku',
      render: () => (
        <Input />
      ),
      width: 150
    },
    {
      title: '',
      name: 'id',
      code: 'id',
      render: (id: number, row: Variant) => (
        <DeleteFour />
      ),
      lock: true,
      align: 'center',
      width: 50
    }
  ]

  return (
    <STable
      style={{ marginLeft: -16, marginRight: -16 }}
      useVirtual
      expand={{ value: expands, onChange: setExpands }}
      columns={columns}
      data={value}
      emptyContent={<div style={{ fontSize: 13 }}>Please set up variant options</div>}
    />
  )
}
