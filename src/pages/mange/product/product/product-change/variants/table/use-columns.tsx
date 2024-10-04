import { IconTrash } from '@tabler/icons-react'
import { Button, Form } from 'antd'

import { STableProps } from '@/components/s-table'
import { VariantType } from '@/constant/product'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'
import ColumnInventory from '@/pages/mange/product/product/product-change/variants/table/columns/column-inventory'
import ColumnPrice from '@/pages/mange/product/product/product-change/variants/table/columns/column-price'
import ColumnText from '@/pages/mange/product/product/product-change/variants/table/columns/column-text'
import ColumnTitle from '@/pages/mange/product/product/product-change/variants/table/columns/column-title'
import ColumnVariant from '@/pages/mange/product/product/product-change/variants/table/columns/column-variant'

export interface ColumnsParams {
  variants: Variant[]
  setVariants: (variants: Variant[]) => void
  groupName: string
  expands: number[]
  setExpands: (expands: number[]) => void
  locationId: number
}

export default function useColumns (params: ColumnsParams) {
  const { variants, setVariants, groupName, expands, setExpands, locationId } = params
  const form = Form.useFormInstance()
  const variantType: VariantType = Form.useWatch('variant_type', form)

  const onUpdate = (row: Variant, key: keyof Variant, value: number | string | null) => {
    if (row.children?.length) {
      row.children.forEach(child => {
        // @ts-expect-error
        child[key] = value
      })
      const newValues = variants.map(v => v.id === row.id ? row : v)
      setVariants(newValues)
    } else if (row.parentId) {
      const parent = variants.find(v => v.id === row.parentId)
      if (!parent) return
      // @ts-expect-error
      row[key] = value
      parent.children = parent.children?.map(child => child.id === row.id ? row : child)
      const newValues = variants.map(v => v.id === parent.id ? parent : v)
      setVariants(newValues)
    } else {
      // @ts-expect-error
      row[key] = value
      setVariants(variants.map(v => v.id === row.id ? row : v))
    }
  }

  const columns: STableProps['columns'] = [
    {
      title: <ColumnTitle expands={expands} setExpands={setExpands} variants={variants} variantType={variantType} />,
      code: 'id',
      name: 'id',
      render: (text, record) => {
        return <ColumnVariant expands={expands} groupName={groupName} row={record} />
      },
      width: 300,
      hidden: variantType === VariantType.Single,
      lock: true
    },
    {
      title: 'Price',
      code: 'price',
      name: 'price',
      render: (price: number, row: Variant) => {
        return (
          <ColumnPrice
            type={'price'}
            row={row}
            onChange={v => { onUpdate(row, 'price', v) }}
            value={price}
          />
        )
      },
      width: 150
    },
    {
      title: 'Compare at price',
      code: 'compare_at_price',
      name: 'compare_at_price',
      render: (compare_at_price: number, row: Variant) => {
        return (
          <ColumnPrice
            type={'compare_at_price'}
            row={row}
            onChange={v => { onUpdate(row, 'compare_at_price', v) }}
            value={compare_at_price}
          />
        )
      },
      width: 150
    },
    {
      title: 'Cost per item',
      code: 'cost_per_item',
      name: 'cost_per_item',
      render: (cost_per_item: number, row: Variant) => {
        return (
          <ColumnPrice
            type={'cost_per_item'}
            row={row}
            onChange={v => { onUpdate(row, 'cost_per_item', v) }}
            value={cost_per_item}
          />
        )
      },
      width: 150
    },
    {
      title: 'Inventory',
      code: 'inventories',
      name: 'inventories',
      render: (inventories: Variant['inventories'], row: Variant) => {
        return (
          <ColumnInventory
            expands={expands}
            setExpands={setExpands}
            locationId={locationId}
            onChange={v => { onUpdate(row, 'inventories', v as any) }}
            value={inventories}
            row={row}
          />
        )
      },
      width: 150
    },
    {
      title: 'Sku',
      code: 'sku',
      name: 'sku',
      render: (sku: string, row: Variant) => {
        return (
          <ColumnText
            expands={expands}
            setExpands={setExpands}
            type={'sku'}
            row={row}
            onChange={v => { onUpdate(row, 'sku', v) }}
            value={sku}
          />
        )
      },
      width: 200
    },
    {
      title: 'Barcode',
      code: 'barcode',
      name: 'barcode',
      render: (barcode: string, row: Variant) => {
        return (
          <ColumnText
            expands={expands}
            setExpands={setExpands}
            type={'barcode'}
            row={row}
            onChange={v => { onUpdate(row, 'barcode', v) }}
            value={barcode}
          />
        )
      },
      width: 200
    },
    {
      title: '',
      code: 'id',
      name: 'id',
      render: (id: number, row: Variant) => {
        return (
          <Button style={{ height: 32 }} size={'small'} type={'text'}>
            <IconTrash size={16} />
          </Button>
        )
      },
      align: 'center',
      lock: true,
      width: 50
    }
  ]

  return { columns }
}
