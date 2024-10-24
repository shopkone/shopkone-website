import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconAlertCircleFilled, IconPhoto } from '@tabler/icons-react'
import { useInViewport, useRequest } from 'ahooks'
import { Button, Checkbox, Flex } from 'antd'

import { FileType } from '@/api/file/add-file-record'
import { ProductListApi, ProductListReq, ProductListRes } from '@/api/product/list'
import FileImage from '@/components/file-image'
import SLoading from '@/components/s-loading'
import SModal from '@/components/s-modal'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import Filters from '@/components/select-product/filters'
import Status from '@/components/status'
import { VariantStatus } from '@/constant/product'
import { UseOpenType } from '@/hooks/useOpen'
import { formatPrice } from '@/utils/num'

export interface SelectProductProps {
  info: UseOpenType<number[]>
  onConfirm?: (value: number[]) => void
}

export default function SelectProduct (props: SelectProductProps) {
  const { info, onConfirm } = props
  const [params, setParams] = useState<ProductListReq>({ page: 1, page_size: 50 })
  const [selected, setSelected] = useState<number[]>([])
  const [list, setList] = useState<ProductListRes[]>([])
  const productList = useRequest(ProductListApi, { manual: true })
  const [showMoreLoading, setShowMoreLoading] = useState(false)
  const onClickRow = (row: ProductListRes) => {
    setSelected(selected.includes(row.id) ? selected.filter(id => id !== row.id) : [...selected, row.id])
  }

  const { t } = useTranslation('common', { keyPrefix: 'selectProduct' })

  const moreRef = useRef<HTMLDivElement>(null)
  const [inViewport] = useInViewport(moreRef)
  const columns: STableProps['columns'] = [
    {
      title: '',
      code: 'id',
      name: 'id',
      render: (id: number, row: ProductListRes) => (
        <Checkbox style={{ marginLeft: 4 }} onClick={() => { onClickRow(row) }} checked={selected.includes(id)} />
      ),
      width: 35
    },
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
      width: 300,
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
      width: 150
    },
    {
      title: t('库存'),
      code: 'quantity',
      name: 'quantity',
      render: (_, row: ProductListRes) => {
        const everyInStock = row.variants?.every(variant => variant.quantity > 0)
        const someInStock = row.variants?.some(variant => variant.quantity > 0)
        return (
          <div>
            <Flex>
              <div>{t('x在售', { count: row.variants?.reduce((sum, variant) => sum + variant.quantity, 0) })}</div>
              <SRender render={row.variants?.length !== 1}>
                <span
                  style={{
                    padding: '0 6px',
                    transform: 'scale(1.5)'
                  }}
                >·
                </span>
                {t('x种款式', { count: row.variants?.length || 0 })}
              </SRender>
            </Flex>
            <Flex style={{ color: '#856404', display: !someInStock ? 'flex' : 'none' }} align={'center'} gap={4}>
              <IconAlertCircleFilled size={15} strokeWidth={2} />
              <Flex align={'center'}><SRender render={!everyInStock && someInStock}>{t('部分')} - </SRender>{t('库存不足')}</Flex>
            </Flex>
          </div>
        )
      },
      width: 200
    },
    {
      title: t('状态1'),
      code: 'status',
      name: 'status',
      width: 120,
      render: (status: VariantStatus) => {
        if (status === VariantStatus.Published) {
          return <Status borderless type={'success'}>{t('已发布1')}</Status>
        }
        return <Status borderless type={'default'}>{t('草稿1')}</Status>
      }
    }
  ]

  const onOk = () => {
    onConfirm?.(selected)
    info.close()
  }

  const isAllSelect = (selected.length === productList.data?.total) || (selected.length === list.length)

  const onSelectAll = () => {
    if (isAllSelect) {
      setSelected([])
    } else {
      const n = [...list.map(item => item.id), ...(info.data || [])]
      setSelected([...new Set(n)])
    }
  }

  useEffect(() => {
    if (!list?.length) return
    if (!productList?.data?.total) {
      setShowMoreLoading(false)
      return
    }
    if (productList?.data?.total > list?.length) {
      setTimeout(() => {
        setShowMoreLoading(info.open)
      }, 500)
    } else {
      setShowMoreLoading(false)
    }
  }, [list])

  useEffect(() => {
    if (!info.open) return
    productList.runAsync(params).then(res => {
      if (res.page.page === 1) {
        setList(res.list)
      } else {
        setList([...list, ...res.list])
      }
    })
  }, [params])

  useEffect(() => {
    if (!info.open) return
    setList([])
    setSelected(info.data || [])
    setParams({ page: 1, page_size: 50 })
    setShowMoreLoading(false)
  }, [info.open])

  useEffect(() => {
    if (!inViewport || !showMoreLoading || productList.loading) return
    setParams(prev => ({ ...prev, page: prev.page + 1 }))
  }, [inViewport])

  return (
    <SModal
      footer={(
        <Flex align={'center'} justify={'space-between'}>
          <Flex align={'center'} gap={12}>
            <Checkbox
              onChange={onSelectAll}
              checked={isAllSelect}
              indeterminate={!isAllSelect && !!selected.length}
            />
            <SRender render={selected.length}>
              <div>{t('已选', { count: selected.length })}</div>
              <span>/</span>
            </SRender>
            <div>{t('共', { count: productList.data?.total })}</div>
          </Flex>
          <Flex gap={12}>
            <Button onClick={info.close}>{t('取消')}</Button>
            <Button onClick={onOk} type={'primary'}>{t('确定')}</Button>
          </Flex>
        </Flex>
    )}
      width={1000}
      title={t('选择商品')}
      onCancel={info.close}
      open={info.open}
    >
      <div >
        <Filters value={params} onChange={p => { setParams({ ...params, ...p }) }} />
        <div style={{ overflowY: 'auto', height: 550, paddingBottom: 24 }}>
          <STable
            loading={productList.loading ? !list.length || !showMoreLoading : false}
            init={!!productList.data}
            columns={columns}
            data={list || []}
            onRowClick={onClickRow}
          />
          <SRender render={showMoreLoading}>
            <Flex ref={moreRef} justify={'center'} align={'center'} gap={12} style={{ paddingTop: 24, opacity: list.length ? 1 : 0 }}>
              <div><SLoading size={20} /></div>
              {t('加载中')}
            </Flex>
          </SRender>
          <SRender
            style={{ display: 'flex', paddingTop: 24, justifyContent: 'center' }}
            render={!showMoreLoading && !productList.loading}
            className={'fit-width secondary'}
          >
            - {t('已经到底了')} -
          </SRender>
        </div>
      </div>
    </SModal>
  )
}
