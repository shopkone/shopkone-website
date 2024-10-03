import { STableProps } from '@/components/s-table'
import ColumnPrice from '@/pages/mange/product/product/product-change/variants/table/columns/column-price'
import ColumnText from '@/pages/mange/product/product/product-change/variants/table/columns/column-text'
import { Variant } from '@/pages/mange/product/product/product-change/variants/variant-table'

export interface ColumnsParams {
  variants: Variant[]
  setVariants: (variants: Variant[]) => void
}

export default function useColumns (params: ColumnsParams) {
  const onUpdate = (parentId: number, id: number, key: string, value: number | string) => {
    if (parentId) {
    } else {
      const row = params.variants.find(v => v.id === id)
      row[key] = value
    }
    params.setVariants([...params.variants])
  }

  const columns: STableProps['columns'] = [
    {
      title: 'Variants',
      code: 'id',
      name: 'id',
      render: (text, record) => {
        return <div>123</div>
      }
    },
    {
      title: 'Price',
      code: 'price',
      name: 'price',
      render: (price: number, row: Variant) => {
        return (
          <ColumnPrice
            onChange={v => { onUpdate(row.parentId || 0, row.id, 'price', v) }}
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
            onChange={v => { onUpdate(row.parentId || 0, row.id, 'compare_at_price', v) }}
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
            onChange={v => { onUpdate(row.parentId || 0, row.id, 'cost_per_item', v) }}
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
            onChange={v => { onUpdate(row.parentId || 0, row.id, 'sku', v) }}
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
            onChange={v => { onUpdate(row.parentId || 0, row.id, 'barcode', v) }}
            value={barcode}
          />
        )
      }
    }
  ]

  return { columns }
}
