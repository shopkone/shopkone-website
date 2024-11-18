import { useTranslation } from 'react-i18next'
import { IconPhoto, IconTag, IconTrash } from '@tabler/icons-react'
import { Button, Flex } from 'antd'

import { FileType } from '@/api/file/add-file-record'
import { OrderVariant } from '@/api/order/create-order'
import { useVariantsByIds } from '@/api/product/variants-by-ids'
import FileImage from '@/components/file-image'
import IconButton from '@/components/icon-button'
import SCard from '@/components/s-card'
import SEmpty from '@/components/s-empty'
import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import SelectVariants from '@/components/select-variants'
import { useOpen } from '@/hooks/useOpen'
import { useFormatPrice } from '@/utils/num'

export interface ProductsProps {
  onChange?: (value: OrderVariant[]) => void
  value?: OrderVariant[]
}

export default function Products (props: ProductsProps) {
  const { onChange, value } = props
  const { t } = useTranslation('orders', { keyPrefix: 'drafts' })
  const selectProductInfo = useOpen<number[]>()
  const { run, loading } = useVariantsByIds()
  const { loading: formatLoading, format } = useFormatPrice()

  const columns: STableProps['columns'] = [
    {
      title: t('商品'),
      code: 'id',
      name: 'id',
      render: (_, row: OrderVariant) => (
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
            <Button style={{ padding: 0 }} type={'link'} size={'small'}>
              {format(row.price)}
            </Button>
          </div>
        </Flex>
      ),
      width: 280
    },
    {
      title: t('数量'),
      code: 'quantity',
      name: 'quantity',
      render: (quantity: number) => (
        <SInputNumber value={quantity} uint min={1} />
      ),
      width: 120
    },
    {
      title: t('合计'),
      code: 'price',
      name: 'price',
      render: (price: number, row: OrderVariant) => (
        format(row.quantity * price)
      ),
      width: 130
    },
    {
      title: '',
      code: 'id',
      name: 'id',
      render: (id: number) => (
        <IconButton type={'text'} size={24}>
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
          if (!ret) return
          const items: OrderVariant[] = ids.map(id => {
            const find = ret.find(i => i.id === id)
            return {
              image: find?.image || '',
              variant_id: id,
              variant_name: find?.name || '',
              product_id: 0,
              product_title: find?.product_title || '',
              price: find?.price || 0,
              quantity: 1
            }
          })
          onChange?.(items)
        }}
      />
    </SCard>
  )
}
