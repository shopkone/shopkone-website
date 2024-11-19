import { useTranslation } from 'react-i18next'
import { IconPhoto, IconTag, IconTrash } from '@tabler/icons-react'
import { useMemoizedFn } from 'ahooks'
import { Button, Flex } from 'antd'

import { FileType } from '@/api/file/add-file-record'
import { DiscountType, OrderVariant } from '@/api/order/create-order'
import { useVariantsByIds, VariantsByIdsRes } from '@/api/product/variants-by-ids'
import FileImage from '@/components/file-image'
import IconButton from '@/components/icon-button'
import SCard from '@/components/s-card'
import SEmpty from '@/components/s-empty'
import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import SelectVariants from '@/components/select-variants'
import { InventoryPolicy } from '@/constant/product'
import { useOpen } from '@/hooks/useOpen'
import ChangeDiscountModal, { ChangeDiscountData } from '@/pages/mange/order/draft/change/change-discount-modal'
import { roundPrice, useFormatPrice } from '@/utils/num'

import styles from './index.module.less'

export interface ProductsProps {
  onChange?: (value: OrderVariant[]) => void
  value?: OrderVariant[]
}

export default function Products (props: ProductsProps) {
  const { onChange, value } = props
  const { t } = useTranslation('orders', { keyPrefix: 'drafts' })
  const selectProductInfo = useOpen<number[]>()
  const { run, loading } = useVariantsByIds({ has_inventory: true })
  const { loading: formatLoading, format } = useFormatPrice()

  const changeDiscountOpen = useOpen<ChangeDiscountData>()

  const onUpdateQuantity = (id: number, quantity: number) => {
    const newList = value?.map(variant => {
      if (variant.variant_id === id) {
        return { ...variant, quantity: quantity || 1 }
      }
      return variant
    })
    onChange?.(newList || [])
  }

  const onRemoveItem = useMemoizedFn((id: number) => {
    const newList = value?.filter(variant => variant.variant_id !== id) || []
    onChange?.(newList)
  })

  const checkIsOverInventory = useMemoizedFn((row: VariantsByIdsRes & OrderVariant) => {
    const big = (typeof row.inventory === 'number') ? row.quantity > row.inventory : false
    return row.inventory_policy !== InventoryPolicy.Continue && row.inventory_tracking && big
  })

  const calculateDiscountMoney = useMemoizedFn((row: OrderVariant) => {
    if (row.discount?.type && row.discount?.value) {
      if (row.discount.type === DiscountType.Fixed) {
        return row.price - row.discount.value
      } else {
        return row.price * (1 - row.discount.value / 100)
      }
    } else {
      return row.price
    }
  })

  const columns: STableProps['columns'] = [
    {
      title: t('商品'),
      code: 'id',
      name: 'id',
      render: (_, row: OrderVariant & VariantsByIdsRes) => (
        <Flex align={'center'} gap={16}>
          <SRender render={row.image}>
            <FileImage size={16} width={42} height={42} src={row.image} type={FileType.Image} />
          </SRender>
          <SRender render={!row.image}>
            <Flex align={'center'} justify={'center'} style={{ width: 42, height: 42, background: '#f5f5f5', border: '1px solid #eee', borderRadius: 8 }}>
              <IconPhoto color={'#ddd'} />
            </Flex>
          </SRender>
          <div>
            <div>{row.product_title}</div>
            <div className={'secondary'}>{row.variant_name}</div>
            <Flex gap={4} align={'center'}>
              <Button
                onClick={() => {
                  changeDiscountOpen.edit({
                    variant_id: row.variant_id,
                    discount: row.discount
                  })
                }}
                style={{ padding: 0 }} type={'link'} size={'small'}
              >
                {format(roundPrice(calculateDiscountMoney(row)))}
              </Button>
              <SRender
                render={row.discount?.type ? row.discount?.value : null}
                className={row.discount?.type && row.discount?.value ? styles.lineMoney : ''}
              >
                {format(row.price)}
              </SRender>
            </Flex>
          </div>
        </Flex>
      ),
      width: 280
    },
    {
      title: t('数量'),
      code: 'quantity',
      name: 'quantity',
      render: (quantity: number, row: VariantsByIdsRes & OrderVariant) => {
        return (
          <div>
            <SInputNumber
              onChange={(v) => { onUpdateQuantity(row.variant_id, v || 1) }}
              value={quantity || 1}
              uint
              required
              min={1}
            />
            <SRender className={styles.err} render={checkIsOverInventory(row)}>
              {t('超出库存，无法下单')}
            </SRender>
          </div>
        )
      },
      width: 120
    },
    {
      title: t('合计'),
      code: 'price',
      name: 'price',
      render: (price: number, row: OrderVariant) => (
        format(row.quantity * roundPrice(calculateDiscountMoney(row)))
      ),
      width: 130
    },
    {
      title: '',
      code: 'id',
      name: 'id',
      render: (id: number) => (
        <IconButton onClick={() => { onRemoveItem(id) }} type={'text'} size={24}>
          <IconTrash size={15} />
        </IconButton>
      )
    }
  ]

  return (
    <SCard
      loading={formatLoading || loading}
      extra={
        <Button onClick={() => { selectProductInfo.edit(value?.map(i => i.variant_id)) }} type={'link'} size={'small'} >
          {t('选择商品')}
        </Button>
      }
      title={t('商品')}
    >
      <SRender render={!value?.length}>
        <SEmpty
          title={t('订单包含哪些商品')}
          image={<IconTag size={52} color={'#eee'} />}
        >
          <Button onClick={() => { selectProductInfo.edit([]) }} style={{ minWidth: 150 }} >
            {t('选择商品')}
          </Button>
        </SEmpty>
      </SRender>

      <SRender render={!!value?.length}>
        <STable
          rowKey={'variant_id'}
          borderless
          className={'table-border'}
          data={value || []}
          columns={columns}
        />
      </SRender>

      <SelectVariants
        info={selectProductInfo}
        onConfirm={async (ids) => {
          const ret = await run({ ids })
          const items: OrderVariant[] = ids.map(id => {
            const find = ret?.find(i => i.id === id)
            return {
              ...find,
              image: find?.image || '',
              variant_id: id,
              variant_name: find?.name || '',
              product_id: 0,
              product_title: find?.product_title || '',
              price: find?.price || 0,
              quantity: 1,
              inventory: find?.inventory || 0
            }
          })
          onChange?.(items)
        }}
      />

      <ChangeDiscountModal
        onConfirm={(data) => {
          const newList = value?.map(variant => {
            if (variant.variant_id === data.variant_id) {
              return { ...variant, discount: data.discount }
            }
            return variant
          })
          onChange?.(newList || [])
        }}
        openInfo={changeDiscountOpen}
      />
    </SCard>
  )
}
