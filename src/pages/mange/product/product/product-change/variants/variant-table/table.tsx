import { useState } from 'react'
import { AddPicture, DeleteFour, Down, Up } from '@icon-park/react'
import { Button, Checkbox, Flex, Form, Input, Select, Tooltip } from 'antd'
import cloneDeep from 'lodash/cloneDeep'

import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import { WEIGHT_UNIT_OPTIONS } from '@/constant/product'
import { Variant } from '@/pages/mange/product/product/product-change/variants/variant-table/index'
import { formatPrice } from '@/utils/num'

import styles from './index.module.less'

export interface TableProps {
  value: Variant[]
  onChange: (value: Variant[]) => void
  groupName?: string
  isSingleVariantType: boolean
}

export default function Table (props: TableProps) {
  const { value, onChange, groupName, isSingleVariantType } = props
  const [expands, setExpands] = useState<number[]>([])
  const form = Form.useFormInstance()
  const inventoryTracking = Form.useWatch('inventory_tracking', form)

  const updateFormData = (row: Variant, key: string, v: any) => {
    if (row.isParent) {
      row.children = row.children?.map(child => {
        return { ...child, [key]: v }
      })
      const newValue = value?.map(i => i.id === row.id ? row : i)
      onChange(cloneDeep(newValue))
      return
    }
    const s = value?.map(variant => {
      if (row.parentId) {
        const children = variant.children?.map(child => child.id === row.id ? { ...child, [key]: v } : child)
        return { ...variant, children }
      }
      return variant.id === row.id ? { ...variant, [key]: v } : variant
    })
    onChange(cloneDeep(s))
  }

  const getPriceRange = (prices?: Array<number | undefined>) => {
    // @ts-expect-error
    const list: number[] = prices?.filter(i => typeof i === 'number') || []
    if (!list?.length) return { value: undefined, placeHolder: '0.00' }
    const max = Math.max(...list)
    const min = Math.min(...list)
    if (min === max) {
      return { value: max, placeHolder: undefined }
    }
    return {
      placeHolder: [formatPrice(min), formatPrice(max)].join(' - '),
      value: undefined
    }
  }

  const changeExpandAll = () => {
    if (value?.map(i => i.id).some(i => expands.includes(i))) {
      setExpands([])
    } else {
      setExpands(value?.map(i => i.id))
    }
  }

  const changeExpandOne = (id: number) => {
    setExpands(expands.includes(id) ? expands.filter(i => i !== id) : [...expands, id])
  }

  const columns: STableProps['columns'] = [
    {
      title: (
        <span>
          <Checkbox style={{ marginRight: 16, marginLeft: -8 }} />
          Variant
          <SRender render={!!groupName}>
            <span style={{ padding: '0 6px' }}>·</span>
            <span onClick={changeExpandAll} className={styles['expand-all']}>
              {value?.map(i => i.id).some(i => expands.includes(i)) ? 'collapse' : 'expand all'}
            </span>
          </SRender>
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
      width: 300,
      lock: true,
      hidden: isSingleVariantType
    },
    {
      title: 'Price',
      code: 'price',
      name: 'price',
      render: (price: number, row: Variant) => {
        return (
          <div>
            <SRender style={{ fontSize: 13 }} className={'tips'} render={row.isParent}>
              <Tooltip title={`Applies to all ${row?.children?.length} variants`}>
                <SInputNumber
                  onChange={(v) => { updateFormData(row, 'price', v) }}
                  money
                  value={getPriceRange(row?.children?.map(i => i.price))?.value}
                  placeholder={getPriceRange(row?.children?.map(i => i.price))?.placeHolder}
                />
              </Tooltip>
            </SRender>
            <SRender render={!row.isParent}>
              <SInputNumber
                money
                placeholder={'0.00'}
                value={price}
                onChange={(v) => { updateFormData(row, 'price', v) }}
              />
            </SRender>
          </div>
        )
      },
      width: 150
    },
    {
      title: 'Cost per item',
      name: 'cost_per_item',
      code: 'cost_per_item',
      render: (cost_per_item: number, row: Variant) => {
        return (
          <div>
            <SRender style={{ fontSize: 13 }} className={'tips'} render={row.isParent}>
              <Tooltip title={`Applies to all ${row?.children?.length} variants`}>
                <SInputNumber
                  onChange={(v) => { updateFormData(row, 'cost_per_item', v) }}
                  money
                  value={getPriceRange(row?.children?.map(i => i.cost_per_item))?.value}
                  placeholder={getPriceRange(row?.children?.map(i => i.cost_per_item))?.placeHolder}
                />
              </Tooltip>
            </SRender>
            <SRender render={!row.isParent}>
              <SInputNumber
                money
                placeholder={'0.00'}
                value={cost_per_item}
                onChange={(v) => { updateFormData(row, 'cost_per_item', v) }}
              />
            </SRender>
          </div>
        )
      },
      width: 150
    },
    {
      title: 'Compare at price',
      name: 'compare_at_price',
      code: 'compare_at_price',
      render: (compare_at_price: number, row: Variant) => {
        return (
          <div>
            <SRender style={{ fontSize: 13 }} className={'tips'} render={row.isParent}>
              <Tooltip title={`Applies to all ${row?.children?.length} variants`}>
                <SInputNumber
                  onChange={(v) => { updateFormData(row, 'compare_at_price', v) }}
                  money
                  value={getPriceRange(row?.children?.map(i => i.compare_at_price))?.value}
                  placeholder={getPriceRange(row?.children?.map(i => i.compare_at_price))?.placeHolder}
                />
              </Tooltip>
            </SRender>
            <SRender render={!row.isParent}>
              <SInputNumber
                money
                placeholder={'0.00'}
                value={compare_at_price}
                onChange={(v) => { updateFormData(row, 'compare_at_price', v) }}
              />
            </SRender>
          </div>
        )
      },
      width: 150
    },
    {
      title: 'Inventory',
      name: 'inventory',
      code: 'inventory',
      render: () => (
        <SInputNumber uint placeholder={'0'} />
      ),
      hidden: !inventoryTracking,
      width: 150
    },
    {
      title: 'Weight',
      name: 'weight',
      code: 'weight',
      render: (weight: number, row: Variant) => (
        <div>
          <SRender render={row.isParent}>
            <Tooltip title={`Applies to all ${row?.children?.length} variants`}>
              <div style={{ position: 'relative' }}>
                <SInputNumber
                  value={weight}
                  placeholder={'0'}
                  onChange={(v) => {
                    updateFormData(row, 'weight', v)
                  }}
                />
                <Flex
                  className={styles['weight-select-wrapper']}
                  align={'center'}
                  justify={'center'}
                >
                  <Select
                    value={[...new Set(row?.children?.map(i => i.weight_uint))].join('/')}
                    onChange={(v) => {
                      updateFormData(row, 'weight_uint', v)
                    }}
                    style={{ padding: 0 }}
                    variant={'borderless'}
                    size={'small'}
                    suffixIcon={<Down className={styles['weight-select']} size={14} />}
                    options={WEIGHT_UNIT_OPTIONS}
                  />
                </Flex>
              </div>
            </Tooltip>
          </SRender>
          <SRender render={!row.isParent}>
            <div style={{ position: 'relative' }}>
              <SInputNumber
                value={weight}
                placeholder={'0'}
                onChange={(v) => {
                  updateFormData(row, 'weight', v)
                }}
              />
              <Flex
                className={styles['weight-select-wrapper']}
                align={'center'}
                justify={'center'}
              >
                <Select
                  value={row?.weight_uint}
                  onChange={(v) => {
                    updateFormData(row, 'weight_uint', v)
                  }}
                  style={{ padding: 0 }}
                  variant={'borderless'}
                  size={'small'}
                  suffixIcon={<Down className={styles['weight-select']} size={14} />}
                  options={WEIGHT_UNIT_OPTIONS}
                />
              </Flex>
            </div>
          </SRender>
        </div>
      ),
      width: 150
    },
    {
      title: 'SKU',
      name: 'sku',
      code: 'sku',
      render: (sku: string, row: Variant) => (
        <div>
          <SRender onClick={() => { changeExpandOne(row.id) }} render={row.isParent} className={styles['tips-expand']}>
            {row.children?.filter(i => i.sku).length} / {row.children?.length}
          </SRender>
          <SRender render={!row.isParent}>
            <Input
              onChange={(v) => { updateFormData(row, 'sku', v.target?.value) }}
              value={sku}
            />
          </SRender>
        </div>
      ),
      width: 150
    },
    {
      title: 'Barcode',
      name: 'barcode',
      code: 'barcode',
      render: (barcode: string, row: Variant) => (
        <div>
          <SRender onClick={() => { changeExpandOne(row.id) }} render={row.isParent} className={styles['tips-expand']}>
            {row.children?.filter(i => i.barcode).length} / {row.children?.length}
          </SRender>
          <SRender render={!row.isParent}>
            <Input
              onChange={(v) => { updateFormData(row, 'barcode', v.target?.value) }}
              value={barcode}
            />
          </SRender>
        </div>
      ),
      width: 150
    },
    {
      title: '',
      name: 'id',
      code: 'id',
      render: (id: number, row: Variant) => (
        <Button type={'text'} className={styles['delete-btn']}>
          <DeleteFour fill={'#1f2329e0'} size={15} className={styles['delete-btn-inner']} />
        </Button>
      ),
      lock: true,
      align: 'center',
      width: 50,
      hidden: isSingleVariantType
    }
  ]

  return (
    <STable
      init
      loading={false}
      width={916}
      className={styles.table}
      expand={{ value: expands, onChange: setExpands }}
      columns={columns}
      data={value}
      emptyContent={<div style={{ fontSize: 13 }}>Please set up variant options</div>}
    />
  )
}
