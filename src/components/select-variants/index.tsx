import { useEffect, useMemo, useRef, useState } from 'react'
import { IconChevronDown, IconPhoto } from '@tabler/icons-react'
import { useInViewport, useRequest } from 'ahooks'
import { Button, Checkbox, Flex } from 'antd'

import { FileType } from '@/api/file/add-file-record'
import { ProductListApi, ProductListReq, ProductListRes } from '@/api/product/list'
import FileImage from '@/components/file-image'
import SLoading from '@/components/s-loading'
import { sMessage } from '@/components/s-message'
import SModal from '@/components/s-modal'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import Filters from '@/components/select-product/filters'
import Status from '@/components/status'
import { VariantStatus } from '@/constant/product'
import { UseOpenType } from '@/hooks/useOpen'
import { formatPrice } from '@/utils/num'
import { genId } from '@/utils/random'
import { renderText } from '@/utils/render-text'

import styles from './index.module.less'

export interface SelectVariantsProps {
  info: UseOpenType<number[]>
  onConfirm?: (value: number[]) => void
}

interface ProductVariants {
  id: number
  title?: string
  image?: string
  status?: VariantStatus
  price: string
  inventory: string
  is_parent?: boolean
  children?: ProductVariants[]
  variants?: ProductListRes['variants']
}

export default function SelectVariants (props: SelectVariantsProps) {
  const { info, onConfirm } = props
  const [params, setParams] = useState<ProductListReq>({ page: 1, page_size: 50 })
  const [selected, setSelected] = useState<number[]>([])
  const [list, setList] = useState<ProductListRes[]>([])
  const productList = useRequest(ProductListApi, { manual: true })
  const [showMoreLoading, setShowMoreLoading] = useState(false)
  const [expanded, setExpanded] = useState<number[]>([])

  const getPriceRange = (prices?: Array<number | undefined>): string => {
    const list = (prices?.filter(i => typeof i === 'number') || []) as number[]
    if (!list?.length) return '$0'
    const max = Math.max(...list)
    const min = Math.min(...list)
    if (min === max) {
      return `$${max}`
    }
    return `${[formatPrice(min, '$'), formatPrice(max, '$')].join(' - ')}`
  }

  const renderList: ProductVariants[] = useMemo(() => {
    if (!list?.length) return []
    return list.map(item => {
      const children = (item.variants?.map(variant => ({
        id: variant.id,
        price: `$${variant.price || 0}`,
        inventory: `${variant.quantity || 0}`,
        image: variant.image,
        title: variant?.name?.map(i => i.value)?.join(' - ')
      })) || [])?.filter(i => i.title)
      const inventory = item.variants?.reduce((sum, variant) => sum + variant.quantity, 0)
      const price = getPriceRange(item.variants?.map(variant => variant.price))
      return { id: genId(), title: item.title, image: item.image, status: item.status, children, inventory: `${inventory}`, price, is_parent: true, variants: item.variants }
    })
  }, [list])

  const onSelectParent = (row: ProductVariants) => {
    const isSelectAll = row.variants?.every(i => selected.includes(i.id)) || (selected.length === 200)
    let list: number[] = []
    if (isSelectAll) {
      list = selected.filter(i => !row.variants?.map(j => j.id).includes(i))
    } else {
      list = [...selected, ...row.variants?.map(i => i.id) || []]
    }
    if (list.length >= 200) {
      sMessage.warning('Maximum selection limit reached')
    }
    setSelected(list.filter((i, index) => index < 200))
  }

  const onSelectChild = (row: ProductVariants) => {
    const list = selected.includes(row.id) ? selected.filter(i => i !== row.id) : [...selected, row.id]
    if (list.length > 200) {
      sMessage.warning('Maximum selection limit reached')
      return
    }
    setSelected(list)
  }

  const onRowClick = (row: ProductVariants) => {
    if (row.variants) {
      onSelectParent(row)
    } else {
      onSelectChild(row)
    }
  }
  // onClick={() => { setExpanded(expanded.includes(row.id) ? expanded.filter(i => i !== row.id) : [...expanded, row.id]) }}

  const moreRef = useRef<HTMLDivElement>(null)
  const [inViewport] = useInViewport(moreRef)
  const columns: STableProps['columns'] = [
    {
      title: 'Product',
      code: 'product',
      name: 'product',
      render: (_, row: ProductVariants) => (
        <div className={'fit-width'}>
          <SRender render={row.is_parent}>
            <Flex style={{ marginLeft: !row.children?.length ? -8 : 0, cursor: 'pointer' }} align={'center'}>
              <Flex onClick={!row.children?.length ? () => { onSelectParent(row) } : undefined} className={styles.checkbox}>
                <Checkbox
                  indeterminate={!row.variants?.every(i => selected.includes(i.id)) && row.variants?.some(i => selected.includes(i.id))}
                  onChange={() => { onSelectParent(row) }}
                  checked={row.variants?.every(i => selected.includes(i.id))}
                  style={{ marginLeft: 4 }}
                />
              </Flex>

              <Flex
                className={styles.down}
                onMouseDown={e => { e.stopPropagation() }}
                onClick={() => { setExpanded(expanded.includes(row.id) ? expanded.filter(i => i !== row.id) : [...expanded, row.id]) }}
                align={'center'}
              >
                <SRender render={row.image}>
                  <FileImage size={36} width={36} height={36} src={row.image || ''} type={FileType.Image} />
                </SRender>
                <SRender render={!row.image}>
                  <Flex align={'center'} justify={'center'} style={{ width: 38, height: 38, background: '#f5f5f5', border: '1px solid #eee', borderRadius: 8 }}>
                    <IconPhoto color={'#ddd'} />
                  </Flex>
                </SRender>
                <div style={{ marginLeft: 12 }}>
                  <div>{row.title}</div>
                  <SRender style={{ userSelect: 'none' }} render={row.children?.length}>
                    <Flex className={'tips'} align={'center'} gap={4}>
                      {/*     <SRender render={row.variants?.find(i => selected.includes(i.id))}>
                      {row.variants?.filter(i => selected.includes(i.id))?.length} selected<span />/<span />
                    </SRender> */}
                      <div className={styles.downIcon}>{row.children?.length} variants</div>
                      <IconChevronDown
                        className={styles.downIcon}
                        style={{
                          transform: expanded.includes(row.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                          position: 'relative',
                          top: -1
                        }}
                        size={14}
                      />
                    </Flex>
                  </SRender>
                </div>
              </Flex>
            </Flex>
          </SRender>
          <SRender render={!row.is_parent}>
            <Flex className={'fit-width'} style={{ marginLeft: 20, cursor: 'pointer', height: 24 }} align={'center'} gap={12}>
              <Checkbox checked={selected.includes(row.id)} onChange={e => { onSelectChild(row) }} style={{ marginLeft: 4 }} />
              <div>{row.title}</div>
            </Flex>
          </SRender>
        </div>
      ),
      width: 300,
      lock: true
    },
    {
      title: 'Price',
      code: 'price',
      name: 'price',
      width: 150
    },
    {
      title: 'Inventory',
      code: 'inventory',
      name: 'inventory',
      width: 200,
      render: (inventory: number) => (
        renderText(`${inventory} on sale`)
      )
    },
    {
      title: 'Status',
      code: 'status',
      name: 'status',
      width: 120,
      render: (status: VariantStatus) => {
        if (status === VariantStatus.Published) {
          return <Status borderless type={'success'}>Active</Status>
        }
        return <Status borderless type={'default'}>Draft</Status>
      }
    }
  ]

  const onOk = () => {
    onConfirm?.(selected)
    info.close()
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
    if (!renderList?.length || !info.open) return
    setExpanded(renderList.map(i => i.id))
  }, [renderList])

  useEffect(() => {
    if (!inViewport || !showMoreLoading || productList.loading) return
    setParams(prev => ({ ...prev, page: prev.page + 1 }))
  }, [inViewport])

  return (
    <SModal
      footer={(
        <Flex align={'center'} justify={'space-between'}>
          <Flex align={'center'} gap={12}>
            <Flex align={'center'} gap={8}>
              <div>{selected.length} selected</div>
              <span>/</span>
              <div>200 max</div>
            </Flex>
          </Flex>
          <Flex gap={12}>
            <Button onClick={info.close}>Cancel</Button>
            <Button onClick={onOk} type={'primary'}>Done</Button>
          </Flex>
        </Flex>
      )}
      width={1000}
      title={'Select products'}
      onCancel={info.close}
      open={info.open}
    >
      <div >
        <Filters />
        <div style={{ overflowY: 'auto', height: 550, paddingBottom: 24 }}>
          <STable
            useVirtual
            expand={{
              value: expanded,
              onChange: () => {}
            }}
            loading={productList.loading ? !list.length : false}
            init={!!productList.data}
            columns={columns}
            data={renderList || []}
            onRowClick={onRowClick}
          />
          <SRender render={showMoreLoading}>
            <Flex ref={moreRef} justify={'center'} align={'center'} gap={12} style={{ paddingTop: 24, opacity: list.length ? 1 : 0 }}>
              <div><SLoading size={20} /></div>
              Loading
            </Flex>
          </SRender>
          <SRender style={{ display: 'flex', paddingTop: 24, justifyContent: 'center' }} render={!showMoreLoading} className={'fit-width secondary'}>
            - No more -
          </SRender>
        </div>
      </div>
    </SModal>
  )
}
