import { useState } from 'react'
import { useMemoizedFn } from 'ahooks'
import { Flex, Form } from 'antd'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'

import STable from '@/components/s-table'
import { VariantType } from '@/constant/product'
import { expandAtom, Variant } from '@/pages/product/product/product-change/state'
import Actions from '@/pages/product/product/product-change/variants/variant-table/actions'
import Filter from '@/pages/product/product/product-change/variants/variant-table/filter'
import Group from '@/pages/product/product/product-change/variants/variant-table/group'

// @ts-expect-error
import Calculate from './calcaulate-data?worker'
import styles from './index.module.less'

export default function VariantTable () {
  const expand = useAtomValue(expandAtom)
  const form = Form.useFormInstance()
  const [expands, setExpands] = useState<number[]>([])
  const [groupName, setGroupName] = useState<string>()
  const [selected, setSelected] = useState<number[]>([])
  const [dataSource, setDataSource] = useState<Variant[]>()
  const variantType: VariantType = Form.useWatch('variant_type', form)
  const inventoryTracking = Form.useWatch('inventory_tracking', form)

  const onSelectChild = useMemoizedFn((id: number) => {
    setSelected(selected.includes(id) ? selected.filter(i => i !== id) : [...selected, id])
  })

  const calcaulate = useMemoizedFn((v: Variant[]) => {
    const worker: Worker = new Calculate()
    worker.postMessage({
      variants: v,
      groupName
    })
    worker.onmessage = (e) => {
      setDataSource(e.data)
      console.log(e.data)
    }
  })

  return (
    <div
      className={classNames(styles['variant-table'])}
    >
      {
        !!groupName && (
          <Flex
            gap={12} justify={'space-between'} align={'center'} style={{
              marginBottom: 12,
              marginLeft: 4
            }}
          >
            <Group />
            <Actions />
          </Flex>
        )
      }

      <Flex justify={'space-between'} align={'center'}>
        <Filter
          hide={variantType === VariantType.Single}
          groupName={groupName}
          onChange={(v) => {
            // setVariants(v)
            calcaulate(v)
            setSelected([])
          }}
        />
        {
          variantType === VariantType.Single && (
            <div
              className={'tips'} style={{
                fontSize: 13,
                marginTop: -12
              }}
            >Single Variant Mode
            </div>
          )
        }
        <div style={{ marginBottom: 8 }}>
          {
            !groupName && <Actions />
          }
        </div>
      </Flex>

      <STable
        emptyContent={<div style={{ fontSize: 13 }}>Please set up variant options</div>}
        expand={{
          value: expands,
          onChange: setExpands
        }}
        style={{ margin: '0 -16px' }}
        width={expand ? 950 : 612}
        columns={columns}
        data={dataSource || []}
      />
    </div>
  )
}
