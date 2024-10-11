import { useEffect, useRef, useState } from 'react'
import { useRequest } from 'ahooks'
import { Form } from 'antd'

import { FileType } from '@/api/file/add-file-record'
import { fileListByIds, FileListByIdsRes } from '@/api/file/file-list-by-ids'
import SelectFiles from '@/components/media/select-files'
import { STableProps } from '@/components/s-table'
import { VariantType } from '@/constant/product'
import { useOpen } from '@/hooks/useOpen'
import { Variant } from '@/pages/mange/product/product/product-change/variants/state'
import ColumnInventory from '@/pages/mange/product/product/product-change/variants/table/columns/column-inventory'
import ColumnPrice from '@/pages/mange/product/product/product-change/variants/table/columns/column-price'
import ColumnRequired from '@/pages/mange/product/product/product-change/variants/table/columns/column-required'
import ColumnText from '@/pages/mange/product/product/product-change/variants/table/columns/column-text'
import ColumnTitle from '@/pages/mange/product/product/product-change/variants/table/columns/column-title'
import ColumnVariant from '@/pages/mange/product/product/product-change/variants/table/columns/column-variant'
import ColumnWeight from '@/pages/mange/product/product/product-change/variants/table/columns/column-weight'

export interface ColumnsParams {
  variants: Variant[]
  setVariants: (variants: Variant[]) => void
  groupName: string
  expands: number[]
  setExpands: (expands: number[]) => void
  locationId: number
  isFull: boolean
}

export default function useColumns (params: ColumnsParams) {
  const { variants, setVariants, groupName, expands, setExpands, locationId, isFull } = params
  const form = Form.useFormInstance()
  const variantType: VariantType = Form.useWatch('variant_type', form)
  const inventoryTracking = Form.useWatch('inventory_tracking', form)
  const imageOpenInfo = useOpen<number[]>([])
  const editingRow = useRef<Variant | undefined>()
  const fileList = useRequest(fileListByIds, { manual: true })
  const [imageResult, setImageResult] = useState<FileListByIdsRes[]>([])

  const onUpdate = (row: Variant, key: keyof Variant, value: number | string | null | boolean) => {
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

  // 加载列表
  useEffect(() => {
    if (imageOpenInfo.open) return
    const list: Variant[] = []
    variants.forEach(v => {
      if (v.children?.length) {
        v.children.forEach(child => {
          list.push(child)
        })
      } else {
        list.push(v)
      }
    })
    const imageIds = list.map(v => v.image_id).filter(Boolean)
    const fetchList = imageIds.filter(item => {
      return !imageResult?.find(i => i.id === item)
    })
    if (!fetchList?.length) return
    fileList.runAsync({ ids: fetchList.filter(Boolean) as any }).then(r => {
      setImageResult(ii => [...ii, ...r])
    })
  }, [variants, imageOpenInfo.open])

  const columns: STableProps['columns'] = [
    {
      title: <ColumnTitle expands={expands} setExpands={setExpands} variants={variants} variantType={variantType} />,
      code: 'variant',
      name: 'variant',
      render: (text, record: Variant) => {
        return (
          <ColumnVariant
            fileList={imageResult || []}
            expands={expands}
            groupName={groupName}
            row={record}
            onClick={() => {
              editingRow.current = record
              imageOpenInfo.edit(record.image_id ? [record.image_id] : [])
            }}
          />
        )
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
      width: 150,
      hidden: !isFull
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
      width: 150,
      hidden: !isFull
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
      width: 150,
      hidden: !inventoryTracking
    },
    {
      title: 'Weight',
      code: 'weight',
      name: 'weight',
      render: (weight: number, row: Variant) => {
        return (
          <ColumnWeight
            onChangeWeight={v => { onUpdate(row, 'weight', v) }}
            onChangeWeightUnit={v => { onUpdate(row, 'weight_unit', v) }}
            row={row}
          />
        )
      },
      width: 150,
      hidden: !isFull
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
      width: 200,
      hidden: !isFull
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
      width: 200,
      hidden: !isFull
    },
    {
      title: 'Charge Tax',
      code: 'tax_required',
      name: 'tax_required',
      render: (_, row: Variant) => {
        return (
          <ColumnRequired
            onChange={v => { onUpdate(row, 'tax_required', v) }}
            row={row}
            type={'tax_required'}
          />
        )
      },
      width: 150,
      hidden: !isFull
    },
    {
      title: 'Shipping Required',
      code: 'shipping_required',
      name: 'shipping_required',
      render: (_, row: Variant) => {
        return (
          <ColumnRequired
            onChange={v => { onUpdate(row, 'shipping_required', v) }}
            row={row} type={'shipping_required'}
          />
        )
      },
      width: 150,
      hidden: !isFull
    }
  ]

  const ImageUploader = (
    <SelectFiles
      onConfirm={async (list) => {
        const imageId = list[0]
        if (!imageId || !editingRow?.current) return
        onUpdate(editingRow.current, 'image_id', imageId)
        editingRow.current = undefined
        imageOpenInfo.close()
      }}
      info={imageOpenInfo}
      multiple={false}
      includes={[FileType.Image]}
    />
  )

  return { columns, ImageUploader }
}
