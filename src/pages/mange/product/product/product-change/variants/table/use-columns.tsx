import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconTrash } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Form, Tooltip } from 'antd'

import { FileType } from '@/api/file/add-file-record'
import { fileListByIds, FileListByIdsRes } from '@/api/file/file-list-by-ids'
import SelectFiles from '@/components/media/select-files'
import SRender from '@/components/s-render'
import { VariantType } from '@/constant/product'
import { useColumn, UseColumnType } from '@/hooks/use-column'
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
  forceChange: (row: Variant[]) => void
}

export default function useColumns (params: ColumnsParams) {
  const { variants, setVariants, groupName, expands, setExpands, locationId, forceChange } = params
  const form = Form.useFormInstance()
  const variantType: VariantType = Form.useWatch('variant_type', form)
  const inventoryTracking = Form.useWatch('inventory_tracking', form)
  const imageOpenInfo = useOpen<number[]>([])
  const editingRow = useRef<Variant | undefined>()
  const fileList = useRequest(fileListByIds, { manual: true })
  const [imageResult, setImageResult] = useState<FileListByIdsRes[]>([])
  const { t } = useTranslation('product')

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

  const onRemove = (row: Variant) => {
    const list = variants.filter(v => v.id !== row.id)
    const vs: Variant[] = []
    list.forEach(v => {
      if (v.children?.length) {
        vs.push(...v.children)
      } else {
        vs.push(v)
      }
    })
    forceChange(vs)
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

  const cols: UseColumnType[] = [
    {
      title: <ColumnTitle expands={expands} setExpands={setExpands} variants={variants} variantType={variantType} />,
      nick: t('款式'),
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
      forceHidden: variantType === VariantType.Single,
      lock: true,
      required: true
    },
    {
      title: t('售价'),
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
      title: t('原价'),
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
      hidden: true
    },
    {
      title: t('成本价'),
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
      hidden: true
    },
    {
      title: t('库存'),
      code: 'inventories',
      name: 'inventories',
      render: (inventories: Variant['inventories'], row: Variant) => {
        return (
          <ColumnInventory
            locationId={locationId}
            onChange={v => { onUpdate(row, 'inventories', v as any) }}
            value={inventories}
            row={row}
          />
        )
      },
      width: 120,
      forceHidden: !inventoryTracking
    },
    {
      title: t('重量'),
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
      width: 150
    },
    {
      title: t('SKU'),
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
      title: t('条形码'),
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
      hidden: true
    },
    {
      title: t('收取税费'),
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
      hidden: true
    },
    {
      title: t('发货'),
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
      hidden: true
    },
    {
      title: '',
      code: 'actions',
      name: 'actions',
      nick: t('操作'),
      render: (id: number, row: Variant) => {
        return (
          <div>
            <SRender render={row?.children?.length}>
              <Tooltip title={`${t('移除')} ${row?.children?.length} ${t('个款式')}`}>
                <Button onClick={() => { onRemove(row) }} style={{ height: 32 }} size={'small'} type={'text'}>
                  <IconTrash size={16} />
                </Button>
              </Tooltip>
            </SRender>
            <SRender render={!row?.children?.length}>
              <Button onClick={() => { onRemove(row) }} style={{ height: 32 }} size={'small'} type={'text'}>
                <IconTrash size={16} />
              </Button>
            </SRender>
          </div>
        )
      },
      align: 'center',
      lock: true,
      width: 50,
      forceHidden: variantType === VariantType.Single,
      required: true
    }
  ]

  const { columns, ColumnSettings } = useColumn(cols, 'variant')

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

  return { columns, ColumnSettings, ImageUploader }
}
