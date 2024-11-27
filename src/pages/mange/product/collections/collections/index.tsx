import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconCopy, IconEye, IconPhoto, IconTrash } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Tooltip } from 'antd'

import { ProductCollectionListApi, ProductCollectionListReq, ProductCollectionListRes } from '@/api/collection/list'
import { FileType } from '@/api/file/add-file-record'
import FileImage from '@/components/file-image'
import IconButton from '@/components/icon-button'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SEmpty from '@/components/s-empty'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import { CollectionType } from '@/pages/mange/product/collections/change'
import Filters from '@/pages/mange/product/collections/collections/filters'

export default function Collections () {
  const [params, setParams] = useState<ProductCollectionListReq>({ page: 1, page_size: 20 })
  const list = useRequest(ProductCollectionListApi, { manual: true })
  const nav = useNavigate()
  const [selected, setSelected] = useState<number[]>([])
  const { t } = useTranslation('product', { keyPrefix: 'collections' })

  const columns: STableProps['columns'] = [
    {
      title: t('系列名称'),
      code: 'collection',
      name: 'collection',
      render: (_, row: ProductCollectionListRes) => (
        <Flex align={'center'} gap={16}>
          <SRender render={row.cover}>
            <FileImage size={16} width={32} height={32} src={row.cover} type={FileType.Image} />
          </SRender>
          <SRender render={!row.cover}>
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
      title: t('匹配模式1'),
      code: 'collection_type',
      name: 'collection_type',
      render: (collection_type: CollectionType) => {
        if (collection_type === CollectionType.Auto) return t('自动匹配1')
        return t('手动选择1')
      },
      width: 200
    },
    {
      title: t('商品数量'),
      code: 'product_quantity',
      name: 'product_quantity',
      width: 200
    },
    {
      title: t('修改日期'),
      code: 'updated_at',
      name: 'updated_at',
      width: 150
    },
    {
      title: '',
      code: 'action',
      name: 'action',
      align: 'center',
      render: () => (
        <Flex justify={'center'} align={'center'} style={{ marginLeft: -6, cursor: 'default' }} onClick={e => { e.stopPropagation() }} gap={12}>
          <Tooltip title={t('预览')}>
            <IconButton size={25} type={'text'} >
              <IconEye size={17} />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('复制')}>
            <IconButton size={25} type={'text'} >
              <IconCopy size={13} />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('删除')}>
            <IconButton size={25} type={'text'} >
              <IconTrash size={14} />
            </IconButton>
          </Tooltip>
        </Flex>
      ),
      lock: true,
      width: 200
    }
  ]

  useEffect(() => {
    list.run(params)
  }, [params])

  return (
    <Page
      header={
        <SRender render={list?.data?.list?.length}>
          <Button
            onClick={() => { nav('change') }}
            type={'primary'}
          >
            {t('添加系列')}
          </Button>
        </SRender>
      }
      bottom={64} title={t('系列')}
    >
      <SCard styles={{ body: { padding: '8px 0' } }}>
        <Filters />
        <STable
          rowSelection={{
            value: selected,
            onChange: setSelected
          }}
          init={!!list.data}
          columns={columns}
          data={list.data?.list || []}
          onRowClick={(row, rowIndex) => {
            nav(`/products/collections/change/${row.id}`)
          }}
          page={{
            total: list?.data?.total || 0,
            current: params.page,
            pageSize: params.page_size,
            onChange: (page, page_size) => {
              setParams({ ...params, page, page_size })
            }
          }}
        >
          <SEmpty
            title={'Group your products into categories'}
            desc={'Use collections to organize your products into categories and galleries for your online store.'}
          >
            <Button
              onClick={() => { nav('change') }}
              type={'primary'}
            >
              {t('添加系列')}
            </Button>
          </SEmpty>
        </STable>
      </SCard>
    </Page>
  )
}
