import { Form } from 'antd'

import { STableProps } from '@/components/s-table'
import { VariantType } from '@/constant/product'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'
import ColumnPrice from '@/pages/mange/product/product/product-change/variants/table/columns/column-price'
import ColumnText from '@/pages/mange/product/product/product-change/variants/table/columns/column-text'

export interface ColumnsParams {
  variants: Variant[]
  setVariants: (variants: Variant[]) => void
}

export default function useColumns (params: ColumnsParams) {
  const form = Form.useFormInstance()
  const variantType: VariantType = Form.useWatch('variant_type', form)

  const onUpdate = (row: Variant, key: keyof Variant, value: number | string | null) => {
    if (row.children?.length) {
      row.children.forEach(child => {
        // @ts-expect-error
        child[key] = value
      })
      const newValues = params.variants.map(v => v.id === row.id ? row : v)
      params.setVariants(newValues)
    } else if (row.parentId) {
      const parent = params.variants.find(v => v.id === row.parentId)
      if (!parent) return
      // @ts-expect-error
      row[key] = value
      parent.children = parent.children?.map(child => child.id === row.id ? row : child)
      const newValues = params.variants.map(v => v.id === parent.id ? parent : v)
      params.setVariants(newValues)
    } else {
      // @ts-expect-error
      row[key] = value
      params.setVariants(params.variants.map(v => v.id === row.id ? row : v))
    }
  }

  const columns: STableProps['columns'] = [
    {
      title: 'Variants',
      code: 'id',
      name: 'id',
      render: (text, record) => {
        return <div>123</div>
      },
      hidden: variantType === VariantType.Single
    },
    {
      title: 'Price',
      code: 'price',
      name: 'price',
      render: (price: number, row: Variant) => {
        return (
          <ColumnPrice
            row={row}
            onChange={v => { onUpdate(row, 'price', v) }}
            value={price}
          />
        )
      }
    },
    {
      title: 'Compare at price',
      code: 'compare_at_price',
      name: 'compare_at_price',
      render: (compare_at_price: number, row: Variant) => {
        return (
          <ColumnPrice
            row={row}
            onChange={v => { onUpdate(row, 'compare_at_price', v) }}
            value={compare_at_price}
          />
        )
      }
    },
    {
      title: 'Cost per item',
      code: 'cost_per_item',
      name: 'cost_per_item',
      render: (cost_per_item: number, row: Variant) => {
        return (
          <ColumnPrice
            row={row}
            onChange={v => { onUpdate(row, 'cost_per_item', v) }}
            value={cost_per_item}
          />
        )
      }
    },
    {
      title: 'Sku',
      code: 'sku',
      name: 'sku',
      render: (sku: string, row: Variant) => {
        return (
          <ColumnText
            onChange={v => { onUpdate(row, 'sku', v) }}
            value={sku}
          />
        )
      }
    },
    {
      title: 'Barcode',
      code: 'barcode',
      name: 'barcode',
      render: (barcode: string, row: Variant) => {
        return (
          <ColumnText
            onChange={v => { onUpdate(row, 'barcode', v) }}
            value={barcode}
          />
        )
      }
    }
  ]

  return { columns }
}
