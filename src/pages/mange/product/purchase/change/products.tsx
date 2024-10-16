import { useEffect, useMemo } from 'react'
import { IconPhoto, IconTrash } from '@tabler/icons-react'
import { Button, Empty, Flex, Input } from 'antd'

import { FileType } from '@/api/file/add-file-record'
import { useVariantsByIds, VariantsByIdsRes } from '@/api/product/variants-by-ids'
import { PurchaseItem } from '@/api/purchase/create'
import FileImage from '@/components/file-image'
import IconButton from '@/components/icon-button'
import SCard from '@/components/s-card'
import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import SelectVariants from '@/components/select-variants'
import { useI18n } from '@/hooks/use-lang'
import { useOpen } from '@/hooks/useOpen'
import { genId } from '@/utils/random'

export interface ProductsProps {
  onChange?: (value: PurchaseItem[]) => void
  value?: PurchaseItem[]
}

export default function Products (props: ProductsProps) {
  const { value, onChange } = props
  const { run, loading, data } = useVariantsByIds()

  const t = useI18n()
  const openInfo = useOpen<number[]>([])

  const list = useMemo(() => {
    return value?.map(item => {
      const find = data.find(i => i.id === item.variant_id)
      if (!find) return item
      const { id, ...rest } = find
      return { ...item, ...rest }
    })
  }, [value, data]) || []

  const onChangeValue = (i: PurchaseItem, key: keyof PurchaseItem, value: any) => {
    const index = list.findIndex(item => item.id === i.id)
    list[index] = { ...i, [key]: value }
    onChange?.(list || [])
  }

  const columns: STableProps['columns'] = [
    {
      title: t('Products'),
      code: 'id',
      name: 'id',
      render: (_, row: VariantsByIdsRes) => (
        <Flex align={'center'} gap={16}>
          <SRender render={row.image}>
            <FileImage size={16} width={32} height={32} src={row.image} type={FileType.Image} />
          </SRender>
          <SRender render={!row.image}>
            <Flex align={'center'} justify={'center'} style={{ width: 34, height: 34, background: '#f5f5f5', border: '1px solid #eee', borderRadius: 8 }}>
              <IconPhoto color={'#ddd'} />
            </Flex>
          </SRender>
          <div>
            <div>{row.product_title}</div>
            <div className={'secondary'}>{row.name}</div>
          </div>
        </Flex>
      ),
      width: 250
    },
    {
      title: t('Supplier SKU'),
      code: 'sku',
      name: 'sku',
      render: (sku: string, row: PurchaseItem) => (
        <Input value={sku} onChange={e => { onChangeValue(row, 'sku', e.target.value) }} />
      ),
      width: 150
    },
    {
      title: t('Purchasing'),
      code: 'purchasing',
      name: 'purchasing',
      render: (purchasing: number, row: PurchaseItem) => (
        <SInputNumber uint value={purchasing} onChange={(v) => { onChangeValue(row, 'purchasing', v) }} />
      ),
      width: 120
    },
    {
      title: t('Cost'),
      code: 'cost',
      name: 'cost',
      render: (cost: number, row: PurchaseItem) => (
        <SInputNumber money value={cost} onChange={(v) => { onChangeValue(row, 'cost', v) }} />
      ),
      width: 120
    },
    {
      title: t('Tax rate'),
      code: 'tax_rate',
      name: 'tax_rate',
      render: (tax_rate: number, row: PurchaseItem) => (
        <SInputNumber value={tax_rate} suffix={'%'} onChange={(v) => { onChangeValue(row, 'tax_rate', v) }} />
      ),
      width: 100
    },
    {
      title: t('Total'),
      code: 'total',
      name: 'total',
      width: 60
    },
    {
      title: '',
      code: 'action',
      name: 'action',
      render: () => (
        <IconButton type={'text'} size={24}>
          <IconTrash size={15} />
        </IconButton>
      ),
      width: 50,
      align: 'right',
      lock: true
    }
  ]

  useEffect(() => {
    if (!value?.length) return
    const variantIds = value?.map(item => item.variant_id)
    run({ ids: variantIds })
  }, [value])

  return (
    <SCard
      extra={
        <Button
          type={'text'}
          size={'small'}
          className={'primary-text'}
          onClick={() => {
            openInfo.edit(value?.map(item => item.variant_id))
          }}
        >
          {t('Select products')}
        </Button>
      }
      loading={loading}
      title={t('Products')}
      className={'fit-width'}
    >
      <SRender render={!value?.length}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={(
            <Flex style={{ marginTop: 20 }} vertical gap={12}>
              <div>
                {t('Only items with inventory tracking settings can be selected.')}
              </div>
              <Flex align={'center'} justify={'center'}>
                <Button onClick={() => {
                  openInfo.edit(value?.map(item => item.variant_id))
                }}
                >
                  {t('Select products')}
                </Button>
              </Flex>
            </Flex>
          )}
        />
      </SRender>

      <SRender render={!!value?.length}>
        <STable useVirtual={(value?.length || 0) > 20} columns={columns} data={list} init={!!list?.length} />
      </SRender>

      <SelectVariants
        onConfirm={async (ids) => {
          const newList = ids.filter(id => !value?.find(item => item.variant_id === id)).map(item => {
            return { id: genId(), variant_id: item, cost: 0, purchasing: 1, tax_rate: 0, sku: '', total: 0 }
          }) || []
          const oldList = value?.filter(item => ids.includes(item.variant_id)) || []
          onChange?.([...newList, ...oldList])
        }}
        info={openInfo}
      />

    </SCard>
  )
}
