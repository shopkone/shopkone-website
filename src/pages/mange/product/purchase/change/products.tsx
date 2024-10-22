import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { IconChevronDown, IconInfoCircle, IconPhoto, IconTrash } from '@tabler/icons-react'
import { Button, Empty, Flex, Input, Popover, Tooltip, Typography } from 'antd'
import cloneDeep from 'lodash/cloneDeep'

import { FileType } from '@/api/file/add-file-record'
import { useVariantsByIds, VariantsByIdsRes } from '@/api/product/variants-by-ids'
import { PurchaseItem } from '@/api/purchase/base'
import { PurchaseStatus } from '@/api/purchase/info'
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
import { formatPrice, roundPrice } from '@/utils/num'
import { genId } from '@/utils/random'
import { renderText } from '@/utils/render-text'

export interface ProductsProps {
  onChange?: (value: PurchaseItem[]) => void
  value?: PurchaseItem[]
  infoMode: ReactNode
  status?: PurchaseStatus
}

export default function Products (props: ProductsProps) {
  const { value, onChange, infoMode, status } = props
  const { run, data } = useVariantsByIds()
  const { id } = useParams()

  const { t } = useTranslation('product', { keyPrefix: 'purchase' })

  const openInfo = useOpen<number[]>([])
  const [page, setPage] = useState({ current: 1, pageSize: 20 })
  const nav = useNavigate()

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

  const onRemove = (item: VariantsByIdsRes) => {
    onChange?.(value?.filter(i => i.id !== item.id) || [])
  }

  const onChangeValue = (i: PurchaseItem, key: keyof PurchaseItem, v: any) => {
    let item = cloneDeep(value?.find(item => i.id === item.id))
    if (!item) return
    // @ts-expect-error
    item[key] = v
    const productCount = !status || status === PurchaseStatus.Draft ? (item?.purchasing || 0) : i.received
    let total = item?.total
    if (key === 'cost') {
      total = ((Number(v) || 0) + ((v || 0) * (item?.tax_rate || 0) / 100)) * (productCount || 0)
    }
    if (key === 'tax_rate') {
      total = ((item?.cost || 0) + ((item?.cost || 0) * (v || 0) / 100)) * (productCount || 0)
    }
    if (key === 'purchasing') {
      total = ((item?.cost || 0) + ((item?.cost || 0) * (item?.tax_rate || 0) / 100)) * (!status || status === PurchaseStatus.Draft ? v : (i.received || 0))
    }
    item = { ...item, total: roundPrice(total || 0) }
    const newValues = value?.map(valueItem => {
      return item?.id === valueItem.id ? item : valueItem
    })
    onChange?.(newValues || [])
  }

  const toReceive = () => {
    nav(`/products/purchase_orders/receive/${id}`)
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
      width: 250
    },
    {
      title: t('供应商SKU'),
      code: 'sku',
      name: 'sku',
      render: (sku: string, row: PurchaseItem) => (
        <>
          <SRender render={!row.is_deleted}>
            <Typography.Text>
              <SRender render={!infoMode}>
                <Input value={sku} onChange={e => { onChangeValue(row, 'sku', e.target.value) }} />
              </SRender>
              <SRender render={infoMode}>
                {renderText(sku)}
              </SRender>
            </Typography.Text>
          </SRender>
          <SRender className={styles.disabledText} style={{ opacity: 1 }} render={row.is_deleted}>
            <Flex align={'center'} gap={4}>
              <IconInfoCircle size={16} />
              {t('商品已被删除')}
            </Flex>
          </SRender>
        </>
      ),
      width: 150
    },
    {
      title: infoMode ? t('接收') : t('采购量'),
      code: 'purchasing',
      name: 'purchasing',
      render: (purchasing: number, row: PurchaseItem) => (
        <div onMouseDown={e => { e.stopPropagation() }} className={'fit-width'} style={{ cursor: 'default' }}>
          <SRender render={!infoMode}>
            <SInputNumber max={999999} min={1} uint value={purchasing} onChange={(v) => { onChangeValue(row, 'purchasing', v) }} />
          </SRender>
          <SRender render={infoMode}>
            <Flex vertical gap={8} style={{ marginTop: 4 }}>
              <Progress
                received={sum(row.received, row.received_count)}
                rejected={sum(row.rejected, row.rejected_count)}
                purchasing={purchasing}
              />
              <Popover
                arrow={false}
                placement={'bottomLeft'}
                trigger={'click'}
                content={
                  <Detail
                    received={sum(row.received, row.received_count)}
                    purchasing={row.purchasing}
                    rejected={sum(row.rejected, row.rejected_count)}
                    vertical
                  />
                }
                overlayInnerStyle={{ padding: '16px 8px' }}
              >
                <Flex align={'center'} className={styles.more}>
                  {sum(row.rejected_count, row.received, row.rejected, row.received_count)} / {row.purchasing}
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
      title: t('成本'),
      code: 'cost',
      name: 'cost',
      render: (cost: number, row: PurchaseItem) => (
        <div>
          <SRender render={!infoMode}>
            <SInputNumber required money value={cost} onChange={(v) => { onChangeValue(row, 'cost', v) }} />
          </SRender>
          <SRender render={infoMode}>
            ${formatPrice(cost || 0)}
          </SRender>
        </div>
      ),
      width: 120
    },
    {
      title: t('税率'),
      code: 'tax_rate',
      name: 'tax_rate',
      render: (tax_rate: number, row: PurchaseItem) => (
        <div>
          <SRender render={!infoMode}>
            <SInputNumber max={9999} precision={2} required min={0} value={tax_rate} suffix={'%'} onChange={(v) => { onChangeValue(row, 'tax_rate', v) }} />
          </SRender>
          <SRender render={infoMode}>
            {formatPrice(tax_rate || 0)}%
          </SRender>
        </div>
      ),
      width: 100
    },
    {
      title: t('合计1'),
      code: 'total',
      name: 'total',
      width: 100,
      render: (total: number) => (
        <div>{`$${formatPrice(total || 0)}`}</div>
      )
    },
    {
      title: '',
      code: 'action',
      name: 'action',
      render: (_, row: VariantsByIdsRes) => (
        <Flex align={'center'} justify={'center'}>
          <Tooltip title={(!!row.rejected || !!row.received) ? t('无法删除已经接收/拒绝的商品') : t('删除')}>
            <IconButton disabled={!!row.rejected || !!row.received} type={'text'} size={24}>
              <IconTrash onClick={() => { onRemove(row) }} size={15} />
            </IconButton>
          </Tooltip>
        </Flex>
      ),
      width: 50,
      align: 'center',
      lock: true,
      hidden: !!infoMode
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
      title={t('商品')}
      className={'fit-width'}
    >
      <SRender render={!value?.length}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={(
            <Flex style={{ marginTop: 20 }} vertical gap={12}>
              <div>
                {t('仅可选择已启用库存跟踪设置的商品')}
              </div>
              <Flex align={'center'} justify={'center'}>
                <Button onClick={() => {
                  openInfo.edit(value?.map(item => item.variant_id) || [])
                }}
                >
                  {t('选择商品')}
                </Button>
              </Flex>
            </Flex>
          )}
        />
      </SRender>

      <SRender render={!!value?.length}>
        <STable
          rowClassName={row => row?.is_deleted && styles.disabled}
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
          data={renderList?.filter(i => (i as any).image !== undefined) || []}
          init={!!renderList?.filter(i => (i as any).image !== undefined)?.length}
        />
      </SRender>

      <SelectVariants
        isTracking
        onConfirm={async (ids) => {
          const newList = ids.filter(id => !value?.find(item => item.variant_id === id)).map(item => {
            return { id: genId(), variant_id: item, cost: 0, purchasing: 1, tax_rate: 0, sku: '', total: 0 }
          }) || []
          const oldList = value?.filter(item => ids.includes(item.variant_id)) || []
          onChange?.([...newList, ...oldList])
        }}
        info={openInfo}
        disabled={value?.filter(i => i.rejected || i.received)?.map(item => item.variant_id)}
      />

    </SCard>
  )
}
