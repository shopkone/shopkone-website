import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { IconChevronDown, IconPhoto, IconTrash } from '@tabler/icons-react'
import { Button, Empty, Flex, Popover } from 'antd'

import { FileType } from '@/api/file/add-file-record'
import { useVariantsByIds, VariantsByIdsRes } from '@/api/product/variants-by-ids'
import { TransferItem } from '@/api/transfers/create'
import FileImage from '@/components/file-image'
import IconButton from '@/components/icon-button'
import SCard from '@/components/s-card'
import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import SelectVariants from '@/components/select-variants'
import { useOpen } from '@/hooks/useOpen'
import Detail from '@/pages/mange/product/purchase/change/detail'
import Progress from '@/pages/mange/product/purchase/change/progress'
import styles from '@/pages/mange/product/purchase/receive/index.module.less'
import { sum } from '@/utils'
import { genId } from '@/utils/random'
import { renderText } from '@/utils/render-text'

export interface ProductsProps {
  value?: TransferItem[]
  onChange?: (value: TransferItem[]) => void
  onLoading: (loading: boolean) => void
  infoMode?: boolean
}

export default function Products (props: ProductsProps) {
  const { value, onChange, onLoading, infoMode } = props
  const { run, loading, data } = useVariantsByIds()
  const { t } = useTranslation('product')

  const openInfo = useOpen<number[]>([])
  const [page, setPage] = useState({ current: 1, pageSize: 20 })
  const { id } = useParams()

  const renderValue = useMemo(() => {
    if (!value) return []
    return value.filter((item, index) => {
      const start = (page.current - 1) * page.pageSize
      const end = start + page.pageSize
      return index >= start && index < end
    })
  }, [value, page])

  const renderList = useMemo(() => {
    return renderValue?.map(item => {
      const find = data.find(i => i.id === item.variant_id)
      if (!find) return item
      const { id, ...rest } = find
      return { ...item, ...rest }
    })
  }, [renderValue, data]) || []

  const onChangeHandle = (id: number, v?: number) => {
    const item = renderValue?.find(item => item.id === id)
    if (!item) return
    onChange?.(value?.map(i => i.id === id ? { ...item, quantity: v || 0 } : i) || [])
  }

  const onRemoveItem = (id: number) => {
    onChange?.(value?.filter(i => i.id !== id) || [])
  }

  const columns: STableProps['columns'] = [
    {
      title: t('商品'),
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
      width: 250,
      lock: true
    },
    {
      title: t('SKU'),
      code: 'sku',
      name: 'sku',
      render: (sku: string) => renderText(sku),
      width: 200
    },
    {
      title: infoMode ? t('总额') : t('库存数量'),
      code: 'quantity',
      name: 'quantity',
      render: (quantity: number, row: TransferItem) => (
        <div onMouseDown={e => { e.stopPropagation() }} className={'fit-width'} style={{ cursor: 'default' }}>
          <SRender render={!infoMode}>
            <SInputNumber value={quantity} onChange={(v) => { onChangeHandle(row.id, v) }} min={1} />
          </SRender>
          <SRender render={infoMode}>
            <Flex vertical gap={8} style={{ marginTop: 4 }}>
              <Progress
                received={sum(row.received, row.received_count)}
                rejected={sum(row.rejected, row.rejected_count)}
                purchasing={quantity}
              />
              <Popover
                arrow={false}
                placement={'bottomLeft'}
                trigger={'click'}
                content={
                  <Detail
                    received={sum(row.received, row.received_count)}
                    purchasing={row.quantity}
                    rejected={sum(row.rejected, row.rejected_count)}
                    vertical
                  />
                }
                overlayInnerStyle={{ padding: '16px 8px' }}
              >
                <Flex align={'center'} className={styles.more}>
                  {sum(row.rejected_count, row.received, row.rejected, row.received_count)} / {row.quantity}
                  <IconChevronDown style={{ marginLeft: 4, marginTop: -1 }} size={13} />
                </Flex>
              </Popover>
            </Flex>
          </SRender>
        </div>
      ),
      width: infoMode ? 180 : 120
    },
    {
      title: '',
      code: 'id',
      name: 'id',
      render: (_, row: TransferItem) => (
        <Flex align={'center'} justify={'center'}>
          <IconButton onClick={() => { onRemoveItem(row.id) }} type={'text'} size={24}>
            <IconTrash size={15} />
          </IconButton>
        </Flex>
      ),
      width: 60,
      lock: true,
      hidden: infoMode
    }
  ]

  useEffect(() => {
    if (!value?.length) return
    const variantIds = value?.map(item => item.variant_id)
    console.log({ value })
    run({ ids: variantIds })
  }, [value])

  useEffect(() => {
    if (!id) return
    onLoading(!data?.length)
  }, [data, id])

  return (
    <SCard
      title={t('商品')}
      extra={
        <SRender render={value?.length ? !infoMode : null}>
          <Button
            type={'link'}
            size={'small'}
            onClick={() => {
              openInfo.edit(value?.map(item => item.variant_id) || [])
            }}
          >
            {t('选择商品')}
          </Button>
        </SRender>
      }
    >
      <SRender render={!value?.length}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={(
            <Flex style={{ marginTop: 20 }} vertical gap={12}>
              <div style={{ fontSize: 14, fontWeight: 'bolder' }}>
                {t('请选择需要转移库存数量的商品')}
              </div>
              <div>{t('请选择要转移的商品，最多不超过200种商品')}</div>
              <Flex align={'center'} justify={'center'} style={{ marginTop: 8 }}>
                <Button onClick={() => { openInfo.edit([]) }} >
                  {t('选择商品')}
                </Button>
              </Flex>
            </Flex>
          )}
        />
      </SRender>

      <SRender render={value?.length}>
        <STable
          borderless
          className={'table-border'}
          page={{
            pageSize: page.pageSize,
            current: page.current,
            total: value?.length || 0,
            onChange: (current, pageSize) => {
              setPage({ current, pageSize })
            }
          }}
          columns={columns}
          data={renderList}
          loading={loading}
          init
        />
      </SRender>

      <SelectVariants
        onConfirm={async (ids) => {
          const newList = ids.filter(id => !value?.find(item => item.variant_id === id)).map(item => {
            return { id: genId(), variant_id: item, quantity: 1 }
          }) || []
          const oldList = value?.filter(item => ids.includes(item.variant_id)) || []
          onChange?.([...newList, ...oldList])
        }}
        info={openInfo}
      />
    </SCard>
  )
}
