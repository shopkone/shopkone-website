import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconTax, IconTrash } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Empty, Flex, Switch } from 'antd'

import { useCountries } from '@/api/base/countries'
import { TaxActiveApi } from '@/api/tax/active'
import { TaxListApi, TaxListRes, TaxStatus } from '@/api/tax/list'
import { TaxRemoveApi } from '@/api/tax/remove'
import { ShopTaxSwitchShippingApi } from '@/api/tax/tax-shipping'
import { ShopTaxSwitchShippingUpdateApi } from '@/api/tax/tax-shipping-update'
import IconButton from '@/components/icon-button'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import SLoading from '@/components/s-loading'
import { sMessage } from '@/components/s-message'
import { useModal } from '@/components/s-modal'
import SRender from '@/components/s-render'
import STable, { STableProps } from '@/components/s-table'
import { useOpen } from '@/hooks/useOpen'
import AddCountryModal from '@/pages/mange/settings/taxes/taxes/add-country-modal'

import styles from './index.module.less'

export default function Taxes () {
  const { t } = useTranslation('settings', { keyPrefix: 'tax' })
  const nav = useNavigate()
  const list = useRequest(TaxListApi)
  const shippingTax = useRequest(ShopTaxSwitchShippingApi)
  const updateShippingTax = useRequest(ShopTaxSwitchShippingUpdateApi, { manual: true })
  const countries = useCountries()
  const openInfo = useOpen()
  const batchRemove = useRequest(TaxRemoveApi, { manual: true })
  const [selected, setSelected] = useState<number[]>([])
  const onActive = useRequest(TaxActiveApi, { manual: true })
  const modal = useModal()

  const onBatchRemove = async (id?: number) => {
    modal.confirm({
      title: t('确认删除x个收税地区吗？', { x: id ? 1 : selected.length }),
      content: t('删除后配置的内容将被清空。'),
      onOk: async () => {
        const ids = id ? [id] : selected
        await batchRemove.runAsync({ ids })
        list.refresh()
        setSelected([])
        sMessage.success(t('收税地区删除成功'))
      },
      okText: t('删除'),
      okButtonProps: { danger: true }
    })
  }

  const showMoreAction = (list?.data?.length || 0) > 10

  const columns: STableProps['columns'] = [
    {
      title: t('国家/地区'),
      code: 'country_code',
      name: 'country_code',
      render: (code: string, row: TaxListRes) => {
        return (
          <Flex align={'center'} gap={8}>
            <div
              style={{
                height: 24,
                width: 36,
                borderRadius: 4,
                objectFit: 'cover',
                background: `url(${countries?.data?.find((c) => c.code === code)?.flag?.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            {
              countries?.data?.find((c) => c.code === code)?.name || '--'
            }
          </Flex>
        )
      },
      lock: true
    },
    {
      title: t('征收'),
      code: 'status',
      name: 'status',
      render: (status: TaxStatus, row: TaxListRes) => (
        <div style={{ position: 'relative', top: 4 }} onMouseUp={e => { e.stopPropagation() }} className={styles.default}>
          <SLoading size={16} loading={onActive.params[0]?.id === row.id && onActive.loading}>
            <Switch
              onChange={async (v) => {
                const ret = await onActive.runAsync({ id: row.id, active: !!v })
                list.mutate(ret.list)
                sMessage.success(t('征收状态更新成功'))
              }}
              size={'small'}
              checked={status === TaxStatus.Active}
            />
          </SLoading>
        </div>
      ),
      width: 80
    },
    {
      title: '',
      code: 'id',
      name: 'id',
      width: 60,
      align: 'center',
      render: (id: number) => (
        <Flex style={{ justifyContent: 'center' }} onMouseUp={e => { e.stopPropagation() }} className={styles.default} align={'center'} gap={16}>
          <IconButton onClick={async () => { await onBatchRemove(id) }} type={'text'} size={24}>
            <IconTrash size={15} />
          </IconButton>
        </Flex>
      )
    }
  ]
  return (
    <Page
      loading={list.loading || countries.loading || shippingTax.loading}
      width={700}
      title={t('税费设置')}
    >
      <SCard
        extra={
          <SRender render={list?.data?.length}>
            <Button onClick={() => { openInfo.edit() }} type={'link'} size={'small'}>
              {t('添加收税地区')}
            </Button>
          </SRender>
        }
        title={t('收税地区')}
      >
        <SRender render={list?.data?.length} className={'tips'} style={{ marginBottom: 12 }}>
          {t('收税地区提示')}
        </SRender>
        <SRender render={list?.data?.length}>
          <STable
            actions={
              <Button onClick={() => { onBatchRemove() }} size={'small'} danger>
                {t('删除')}
              </Button>
            }
            rowSelection={showMoreAction ? { value: selected, onChange: setSelected, width: 40 } : undefined}
            onRowClick={(record) => { nav(`info/${record.id}`) }}
            init
            className={'table-border'}
            columns={columns}
            data={list?.data || []}
            borderless
          />
        </SRender>
        <SRender render={!list?.data?.length && !list.loading}>
          <Empty
            image={
              <div style={{ paddingTop: 20 }}>
                <IconTax size={64} color={'#ddd'} />
              </div>
            }
            description={(
              <div className={'secondary'}>
                {t('收税地区提示')}
              </div>
            )}
            style={{ paddingBottom: 24 }}
          >
            <Button onClick={() => { openInfo.edit() }} type={'primary'}>{t('添加收税地区')}</Button>
          </Empty>
        </SRender>
      </SCard>

      <SCard
        style={{ marginTop: 16 }}
      >
        <Flex align={'center'} gap={8}>
          <SLoading size={18} loading={updateShippingTax.loading}>
            <Switch
              onChange={e => {
                updateShippingTax.runAsync({ tax_shipping: e }).then(res => {
                  sMessage.success(t('设置成功'))
                  shippingTax.mutate({ tax_shipping: e })
                })
              }}
              size={'small'}
              checked={!!shippingTax.data?.tax_shipping}
            />
          </SLoading>
          {t('所有价格均含税')}
        </Flex>
        <div className={'tips'} style={{ marginTop: 8, marginLeft: 36 }}>
          {t('对运费收的税包含在运费中')}
        </div>
      </SCard>

      <AddCountryModal
        onOk={() => {
          list.refresh()
        }}
        openInfo={openInfo}
        disabled={list?.data?.map(i => i.country_code) || []}
      />
    </Page>
  )
}
