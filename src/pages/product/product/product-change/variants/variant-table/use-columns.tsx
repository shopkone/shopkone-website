import { AddPicture, DeleteFour, Down, Up } from '@icon-park/react'
import { useMemoizedFn } from 'ahooks'
import { BaseTableProps } from 'ali-react-table'
import { Button, Checkbox, Flex, InputNumber, Select } from 'antd'

import SInputNumber from '@/components/s-input-number'
import { VariantType, WEIGHT_UNIT_OPTIONS } from '@/constant/product'
import { Variant } from '@/pages/product/product/product-change/state'
import styles from '@/pages/product/product/product-change/variants/variant-table/index.module.less'

interface IsSelectType {
  some: boolean
  all: boolean
}

export const useColumns = (select: number[]) => {
  const isSelect = useMemoizedFn((row: Variant): IsSelectType => {
    if (row.isParent) {
      const include = (row.children || []).filter(i => select.includes(i.id))
      const all = include.length === row.children?.length
      const some = include.length > 0
      return { some: !all && some, all }
    }
    return { some: select.includes(row.id), all: false, isParent: false }
  })

  const getIsSelectAll = useMemoizedFn(() => {
    return false
  })

  const getIsSelectPart = useMemoizedFn(() => {
    return false
  })

  const onSelectAll = useMemoizedFn(() => {
  })

  const onUpdate = useMemoizedFn((row: Variant, key: string) => {
  })

  const getIsSelectParent = (id: number) => {
  }

  const columns: BaseTableProps['columns'] = [
    {
      title: (
        <span>
          <Checkbox checked={getIsSelectAll()} indeterminate={getIsSelectPart()} onChange={onSelectAll} style={{ marginRight: 16, marginLeft: -8 }} />
          Variant
        </span>
      ),
      name: 'id',
      code: 'id',
      render: (id: number, row: Variant) => (
        <Flex className={styles.variants} align={'center'} gap={16}>
          <Flex align={'center'} gap={12} style={{ cursor: 'default' }} onClick={e => { e.stopPropagation() }} >
            <div style={{ marginLeft: row.isChild ? 8 : (row.isParent ? 0 : -8), marginRight: row.isChild ? -12 : 0 }} >
              <Checkbox />
            </div>
            <Flex
              align={'center'}
              justify={'center'}
              className={styles['add-img']}
              style={{
                width: row?.isChild ? 42 : undefined,
                height: row?.isChild ? 42 : undefined,
                marginLeft: row?.isChild ? 12 : undefined
              }}
            >
              <AddPicture fill={'#3471ff'} size={15} style={{ position: 'relative', top: 2 }} />
            </Flex>
          </Flex>
          <Flex vertical>
            <div style={{
              fontSize: row.isChild ? 12 : 13
            }}
            >{row.name?.map(i => i.value).join(' / ')}
            </div>
            {
              row.isParent
                ? (
                  <Flex gap={4} align={'center'}>
                    <div style={{ color: '#646a73' }}>{row?.children?.length} variants</div>
                    <div style={{
                      position: 'relative',
                      top: 3
                    }}
                    >
                      {
                        expands?.includes(id)
                          ? (
                            <Up size={14} />
                            )
                          : (
                            <Down size={14} />
                            )
                      }
                    </div>
                  </Flex>
                  )
                : null
            }
          </Flex>
        </Flex>
      ),
      width: 230,
      lock: expand,
      hidden: variantType === VariantType.Single
    },
    {
      title: 'Price',
      name: 'price',
      code: 'price',
      render:
        (price: number, row: Variant) => (
          <SInputNumber
            debounce
            money
            onChange={(v) => {
              onUpdate({
                ...row,
                price: Number(v || 0)
              }, 'price')
            }}
            placeholder={'0.00'}
            value={price}
          />
        ),
      width:
        120
    },
    {
      title: 'Compare at price',
      name:
        'compare_at_price',
      code:
        'compare_at_price',
      render:
        () => (
          <SInputNumber money />
        ),
      width: 150
    },
    {
      title: 'Cost per item',
      name: 'cost_per_item',
      code: 'cost_per_item',
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
      width: 120,
      hidden: !inventoryTracking
    },
    {
      title: 'Weight',
      name: 'weight',
      code: 'weight',
      render: (weight: number, row: Variant) => (
        <div style={{ position: 'relative' }}>
          <SInputNumber
            placeholder={'0'}
          />
          <Flex
            align={'center'}
            justify={'center'}
            style={{
              borderRadius: 8,
              position: 'absolute',
              right: 4,
              top: 2
            }}
          >
            <Select
              value={row?.weight_uint}
              style={{ padding: 0 }}
              variant={'borderless'}
              size={'small'}
              suffixIcon={<Down
                size={14}
                style={{
                  position: 'relative',
                  top: 3
                }}
              />}
              options={WEIGHT_UNIT_OPTIONS}
            />
          </Flex>
        </div>
      ),
      width: 120
    },
    {
      title: 'SKU',
      name: 'sku',
      code: 'sku',
      render: () => (
        <InputNumber
          className={'fit-width'}
          min={0}
          maxLength={16}
          precision={2}
          controls={false}
        />
      ),
      width: 150
    },
    {
      title: 'Barcode',
      name: 'barcode',
      code: 'barcode',
      render: () => (
        <InputNumber
          className={'fit-width'}
          min={0}
          maxLength={16}
          precision={2}
          controls={false}
        />
      ),
      width: 150
    },
    {
      title: '',
      name: 'action',
      code: 'action',
      render: () => (
        <Button
          type={'text'} style={{
            height: 24,
            width: 24,
            padding: 0,
            borderRadius: 5
          }}
        >
          <DeleteFour
            fill={'#1f2329e0'} size={15} style={{
              position: 'relative',
              top: 1
            }}
          />
        </Button>
      ),
      width: 50,
      align: 'center',
      lock: true,
      hidden: variantType === VariantType.Single
    }
  ]

  return columns
}
