import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconPhoto, IconTag, IconTrash } from '@tabler/icons-react'
import { Button, Empty, Flex } from 'antd'

import { FileType } from '@/api/file/add-file-record'
import { ProductListByIdsRes, useProductListByIds } from '@/api/product/list-by-ids'
import { ShippingType } from '@/api/shipping/base'
import FileImage from '@/components/file-image'
import IconButton from '@/components/icon-button'
import SCard from '@/components/s-card'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import SelectProduct from '@/components/select-product'
import Status from '@/components/status'
import { VariantStatus } from '@/constant/product'
import { useOpen } from '@/hooks/useOpen'
import { formatPrice } from '@/utils/num'

export interface ProductsProps {
  onChange?: (value: number[]) => void
  value?: number[]
}

export default function Products (props: ProductsProps) {
  const { value, onChange } = props
  const selectInfo = useOpen<number[]>([])
  const products = useProductListByIds()
  const [select, setSelect] = useState<number[]>([])
  const [page, setPage] = useState({ current: 1, pageSize: 20 })
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const type: ShippingType = Number(new URLSearchParams(window.location.search).get('type') || 0)

  const pageValue = useMemo(() => {
    if (!value) return []
    return value.filter((item, index) => {
      const start = (page.current - 1) * page.pageSize
      const end = start + page.pageSize
      return index >= start && index < end
    })
  }, [value, page])

  const onRemove = (id: number) => {
    onChange?.(value?.filter(item => item !== id) || [])
  }

  const columns: STableProps['columns'] = [
    {
      title: t('商品'),
      code: 'product',
      name: 'product',
      render: (_, row: ProductListByIdsRes) => (
        <Flex align={'center'} gap={16}>
          <SRender render={row.image}>
            <FileImage size={16} width={32} height={32} src={row.image} type={FileType.Image} />
          </SRender>
          <SRender render={!row.image}>
            <Flex align={'center'} justify={'center'} style={{ width: 34, height: 34, background: '#f5f5f5', border: '1px solid #eee', borderRadius: 8 }}>
              <IconPhoto color={'#ddd'} />
            </Flex>
          </SRender>
          <div>{row.title}</div>
        </Flex>
      ),
      width: 250,
      lock: true
    },
    {
      title: t('售价1'),
      code: 'price',
      name: 'price',
      render: (_, row: ProductListByIdsRes) => {
        const maxPrice = row.max_price
        const minPrice = row.min_price
        if (maxPrice === minPrice) return formatPrice(maxPrice, '$')
        return <div>{formatPrice(minPrice, '$')} ~ {formatPrice(maxPrice, '$')}</div>
      },
      width: 100
    },
    {
      title: t('状态'),
      code: 'status',
      name: 'status',
      width: 80,
      render: (status: VariantStatus) => {
        if (status === VariantStatus.Published) {
          return <Status borderless type={'success'}>{t('已上架')}</Status>
        }
        return <Status borderless type={'default'}>{t('草稿')}</Status>
      }
    },
    {
      title: '',
      code: 'id',
      name: 'id',
      width: 50,
      render: (_, row: ProductListByIdsRes) => (
        <IconButton type={'text'} size={24}>
          <IconTrash onClick={() => { onRemove(row.id) }} size={15} />
        </IconButton>
      )
    }
  ]

  useEffect(() => {
    products.run(pageValue || [])
  }, [pageValue])

  return (
    <SCard
      extra={
        <SRender render={value?.length}>
          <Button type={'link'} size={'small'} onClick={() => { selectInfo.edit(value || []) }}>
            {t('选择商品')}
          </Button>
        </SRender>
      }
      title={'商品'}
      className={'fit-width'}
    >
      <SRender render={!value?.length && type === ShippingType.CustomerExpressDelivery}>
        <Empty
          image={<IconTag size={64} color={'#eee'} />}
          description={t('暂无数据')}
          style={{ paddingBottom: 24 }}
        >
          <Button onClick={() => { selectInfo.edit([]) }}>
            {t('选择商品')}
          </Button>
        </Empty>
      </SRender>

      <SRender render={value?.length ? type === ShippingType.CustomerExpressDelivery : null}>
        <div className={'tips'} style={{ marginBottom: 8 }}>
          {t('已选商品', { x: value?.length })}
        </div>
        <STable
          borderless
          className={'table-border'}
          rowSelection={{
            value: select,
            onChange: setSelect
          }}
          loading={products.loading}
          init={!!products?.data}
          columns={columns}
          data={pageValue?.map(item => products.data?.find(row => row.id === item))?.filter(Boolean)}
          page={{
            pageSize: page.pageSize,
            current: page.current,
            total: value?.length || 0,
            onChange: (current, pageSize) => {
              setPage({ current, pageSize })
            }
          }}
          actions={
            <div>asd</div>
          }
        />
      </SRender>

      <SelectProduct
        onConfirm={onChange}
        info={selectInfo}
      />

    </SCard>
  )
}
