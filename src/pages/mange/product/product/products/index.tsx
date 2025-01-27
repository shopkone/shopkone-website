import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconAlertCircleFilled, IconCopy, IconDownload, IconEye, IconPhoto, IconPlus } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Switch, Tooltip } from 'antd'
import dayjs from 'dayjs'

import { FileType } from '@/api/file/add-file-record'
import { ProductListApi, ProductListReq, ProductListRes } from '@/api/product/list'
import FileImage from '@/components/file-image'
import IconButton from '@/components/icon-button'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SEmpty from '@/components/s-empty'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import { VariantStatus } from '@/constant/product'
import Filters from '@/pages/mange/product/product/products/filters'
import { formatPrice } from '@/utils/num'
import { renderText } from '@/utils/render-text'

export default function Products () {
  const nav = useNavigate()
  const [params, setParams] = useState<ProductListReq>({
    page: 1,
    page_size: 20,
    status: 0,
    type: 'title',
    keyword: '',
    collections: []
  })
  const list = useRequest(ProductListApi, { manual: true, debounceWait: 300 })
  const [selected, setSelected] = useState<number[]>([])
  const { t } = useTranslation('product', { keyPrefix: 'product' })

  const columns: STableProps['columns'] = [
    {
      title: t('商品'),
      code: 'product',
      name: 'product',
      render: (_, row: ProductListRes) => (
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
      width: 400,
      lock: true
    },
    {
      title: t('售价1'),
      code: 'price',
      name: 'price',
      render: (_, row: ProductListRes) => {
        const allPrice = row.variants?.map(variant => variant.price)
        const maxPrice = Math.max(...allPrice)
        const minPrice = Math.min(...allPrice)
        if (maxPrice === minPrice) return formatPrice(maxPrice, '$')
        return <div>{formatPrice(minPrice, '$')} ~ {formatPrice(maxPrice, '$')}</div>
      },
      width: 120
    },
    {
      title: t('SPU1'),
      code: 'spu',
      name: 'spu',
      render: (spu: string) => renderText(spu),
      width: 150
    },
    {
      title: t('供应商1'),
      code: 'vendor',
      name: 'vendor',
      render: (vendor: string) => renderText(vendor),
      width: 150
    },
    {
      title: t('库存1'),
      code: 'quantity',
      name: 'quantity',
      render: (_, row: ProductListRes) => {
        const everyInStock = row.variants?.every(variant => variant.quantity > 0)
        const someInStock = row.variants?.some(variant => variant.quantity > 0)
        return (
          <div>
            <SRender className={'secondary'} render={!row.inventory_tracking}>
              {t('未跟踪库存')}
            </SRender>
            <SRender render={row.inventory_tracking}>
              <Flex wrap={'wrap'} style={{ columnGap: 8, rowGap: 2, whiteSpace: 'nowrap' }}>
                <Flex>
                  <div>{t('x在售', { x: row.variants?.reduce((sum, variant) => sum + variant.quantity, 0) })}</div>
                  <SRender render={row.variants?.length !== 1}>
                    <span style={{ padding: '0 6px', transform: 'scale(1.5)' }}>·</span>
                    {t('x个款式1', { x: row.variants?.length || 0 })}
                  </SRender>
                </Flex>
                <Flex
                  style={{
                    color: '#b36b00',
                    display: everyInStock ? 'none' : 'flex'
                  }} align={'center'} gap={4}
                >
                  <IconAlertCircleFilled size={15} strokeWidth={2} />
                  <Flex><SRender render={!everyInStock && someInStock}>{t('部分')} - </SRender>{t('库存不足')}</Flex>
                </Flex>
              </Flex>
            </SRender>
          </div>
        )
      },
      width: 200
    },
    {
      title: t('创建时间'),
      code: 'created_at',
      name: 'id',
      width: 120,
      render: (created_at: number) => {
        if (created_at) return dayjs(created_at).format('MM/DD/YYYY')
        return renderText()
      }
    },
    {
      title: t('状态1'),
      code: 'status',
      name: 'status',
      width: 150,
      render: (status: VariantStatus) => (
        <Flex
          style={{ cursor: 'default' }}
          onMouseUp={e => {
            e.stopPropagation()
          }}
          align={'center'} gap={8}
        >
          <Switch size={'small'} checked={status === VariantStatus.Published} />
          <SRender style={{ fontSize: 12, position: 'relative', top: 1 }} render={status === VariantStatus.Published}>
            {t('已上架1')}
          </SRender>
          <SRender style={{ fontSize: 12, position: 'relative', top: 1 }} render={status !== VariantStatus.Published}>
            {t('草稿1')}
          </SRender>
        </Flex>
      )
    },
    {
      title: '',
      code: 'action',
      name: 'action',
      render: () => (
        <Flex justify={'center'} align={'center'} style={{ marginLeft: -6, cursor: 'default' }} onClick={e => { e.stopPropagation() }} gap={12}>
          <Tooltip title={t('预览1')}>
            <IconButton
              onMouseUp={e => {
                e.stopPropagation()
              }}
              size={26}
              type={'text'}
            >
              <IconEye size={17} />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('复制1')}>
            <IconButton
              onMouseUp={e => {
                e.stopPropagation()
              }}
              size={26}
              type={'text'}
            >
              <IconCopy size={13} />
            </IconButton>
          </Tooltip>
        </Flex>
      ),
      width: 100,
      lock: true,
      align: 'center'
    }
  ]

  useEffect(() => {
    list.run(params)
  }, [params])

  return (
    <Page
      bottom={64}
      header={
        <SRender render={list?.data?.list?.length}>
          <Flex gap={8}>
            <Button type={'text'}>{t('导出')}</Button>
            <Button type={'text'}>{t('导入')}</Button>
            <Button type={'text'}>{t('更多操作')}</Button>
            <Button onClick={() => { nav('change') }} type={'primary'}>{t('添加商品')}</Button>
          </Flex>
        </SRender>
      }
      title={t('商品')}
    >
      <SCard styles={{ body: { padding: '8px 0' } }}>
        <Filters
          value={params}
          onChange={p => { setParams({ ...params, ...p }) }}
        />
        <STable
          page={{
            current: params.page,
            pageSize: params.page_size,
            total: list?.data?.total,
            onChange: (page, page_size) => {
              if (page !== params.page) {
                setSelected([])
              }
              setParams({ ...params, page, page_size })
            }
          }}
          onRowClick={(row) => {
            nav(`change/${row?.id}`)
          }}
          loading={list.loading}
          rowSelection={{ onChange: setSelected, value: selected }}
          init={!!list.data}
          columns={columns}
          data={list?.data?.list || []}
        >
          <SEmpty
            title={t('新建并上架你的商品')}
            desc={t('创建提示')}
            type={'empty_product'}
          >
            <Flex gap={12}>
              <Button>
                <IconDownload className={'fpt1'} size={15} />
                <div>{t('导入')}</div>
              </Button>
              <Button>
                <IconDownload className={'fpt1'} size={15} />
                <div>{t('导入 Shopify')}</div>
              </Button>
              <Button
                onClick={() => {
                  nav('change')
                }}
                type={'primary'}
              >
                <IconPlus className={'fpt1'} size={15} />
                <div>{t('添加商品1')}</div>
              </Button>
            </Flex>
          </SEmpty>
        </STable>
      </SCard>
    </Page>
  )
}
