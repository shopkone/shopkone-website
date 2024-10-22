import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { IconChevronDown, IconPhoto } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex } from 'antd'
import isEqual from 'lodash/isEqual'

import { FileType } from '@/api/file/add-file-record'
import { InventoryListApi, InventoryListReq, InventoryListRes } from '@/api/inventory/list'
import { LocationListApi } from '@/api/location/list'
import FileImage from '@/components/file-image'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SInputNumber from '@/components/s-input-number'
import SRender from '@/components/s-render'
import SSelect from '@/components/s-select'
import STable, { STableProps } from '@/components/s-table'
import { useOpen } from '@/hooks/useOpen'
import ChangeHistory from '@/pages/mange/product/inventory/inventory/change-history'
import Filters from '@/pages/mange/product/inventory/inventory/filters'
import { renderText } from '@/utils/render-text'

import styles from './index.module.less'

export default function Inventory () {
  const { id } = useParams()
  const [params, setParams] = useState<InventoryListReq>({ location_id: 0, page: 1, page_size: 20 })
  const locations = useRequest(async () => await LocationListApi({ active: true }))
  const nav = useNavigate()
  const list = useRequest(InventoryListApi, { manual: true })
  const [selected, setSelected] = useState<number[]>([])
  const { t } = useTranslation('product')

  const info = useOpen<{ name: string, id: number }>()

  const columns: STableProps['columns'] = [
    {
      title: t('商品款式'),
      code: 'product',
      name: 'product',
      render: (_, row: InventoryListRes) => (
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
            <div>{row.product_name}</div>
            <div className={'secondary'} style={{ fontSize: 12 }}>{row.name}</div>
          </div>
        </Flex>
      ),
      width: 400,
      lock: true
    },
    {
      title: 'Sku',
      code: 'sku',
      name: 'sku',
      render: (sku: string) => renderText(sku),
      width: 150
    },
    {
      title: t('流程中'),
      code: 'unavailable',
      name: 'unavailable',
      width: 150
    },
    {
      title: t('可售'),
      code: 'quantity',
      name: 'quantity',
      render: (quantity: number) => (
        <SInputNumber style={{ width: 130 }} value={quantity} uint />
      ),
      width: 150
    },
    {
      title: t('现货'),
      code: 'on_hand',
      name: 'on_hand',
      width: 150
    }
  ]

  useEffect(() => {
    if (!id && locations?.data?.[0]?.id) {
      nav(`/products/inventory/${locations.data[0].id}`)
    } else if (id) {
      const newParams = { location_id: Number(id), page: 1, page_size: 20 }
      const isSame = isEqual(params, newParams)
      if (isSame) return
      setParams(newParams)
    }
  }, [locations.data, id])

  useEffect(() => {
    if (!params.location_id) return
    list.run(params)
  }, [params])

  return (
    <Page
      header={
        <SRender render={list?.data?.list?.length}>
          <Flex gap={8}>
            <Button type={'text'}>{t('导出')}</Button>
            <Button type={'text'}>{t('导入')}</Button>
          </Flex>
        </SRender>
      }
      bottom={64}
      title={
        <Flex align={'center'}>
          {t('库存')}
          <SRender render={(locations.data?.length || 0) > 1}>
            <span style={{ paddingLeft: 2 }}>:</span>
            <SSelect
              onChange={v => {
                if (!v) return
                nav(`/products/inventory/${v}`)
              }}
              className={styles.selector}
              value={params.location_id}
              options={locations.data?.map(i => ({
                label: i.name,
                value: i.id
              }))}
              variant={'borderless'}
              suffixIcon={<IconChevronDown color={'#444'} size={16} />}
              dropdownStyle={{ minWidth: 400 }}
            />
          </SRender>
        </Flex>
      }
    >
      <SCard styles={{ body: { padding: '8px 0' } }}>
        <Filters />
        <STable
          onRowClick={(row: InventoryListRes) => {
            info.edit({ name: row.name || row.product_name, id: row.id })
          }}
          rowSelection={{
            value: selected,
            onChange: setSelected
          }}
          loading={list.loading}
          init={!!id && !!locations.data && !!list.data}
          columns={columns}
          data={list.data?.list || []}
          empty={{
            title: t('跟踪商品库存'),
            desc: t('商品启用跟踪库存后，您可以在此查看和调整产品的库存计数。'),
            actions: (
              <Flex gap={8}>
                <Button onClick={() => { nav('/products/products') }} type={'primary'}>{t('前往商品')}</Button>
              </Flex>
            )
          }}
          page={{
            total: list?.data?.total || 0,
            current: params.page,
            pageSize: params.page_size,
            onChange: (page, page_size) => {
              setParams({ ...params, page, page_size })
            }
          }}
        />
      </SCard>

      <ChangeHistory info={info} />
    </Page>
  )
}
