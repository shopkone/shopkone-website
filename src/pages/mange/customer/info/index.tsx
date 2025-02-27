import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { IconDots } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Flex, Popover } from 'antd'

import { useCountries } from '@/api/base/countries'
import { AddressType } from '@/api/common/address'
import { CustomerFreeTax, CustomerInfoApi, CustomerInfoRes, TaxFeeItem } from '@/api/customer/info'
import { RemoveAddressApi } from '@/api/customer/remove-address'
import { UpdateAddressApi, UpdateAddressReq } from '@/api/customer/update-address'
import IconButton from '@/components/icon-button'
import Page from '@/components/page'
import SCard from '@/components/s-card'
import { sMessage } from '@/components/s-message'
import SRender from '@/components/s-render'
import ShowMore from '@/components/show-more'
import Status from '@/components/status'
import { useOpen } from '@/hooks/useOpen'
import AddressModal from '@/pages/mange/customer/info/address-modal'
import CustomerBaseInfo from '@/pages/mange/customer/info/customer-base-info'
import CustomerModal from '@/pages/mange/customer/info/customer-modal'
import NoteModal from '@/pages/mange/customer/info/note-modal'
import TagModal from '@/pages/mange/customer/info/tag-modal'
import TaxModal from '@/pages/mange/customer/info/tax-modal'
import { useManageState } from '@/pages/mange/state'
import { formatAddress } from '@/utils/format'
import { genId } from '@/utils/random'

import styles from './index.module.less'

export default function CustomerInfo () {
  const { t } = useTranslation('customers', { keyPrefix: 'info' })
  const id = Number(useParams().id)
  const info = useRequest(CustomerInfoApi, { manual: true })
  const updateAddress = useRequest(UpdateAddressApi, { manual: true })
  const removeAddress = useRequest(RemoveAddressApi, { manual: true })
  const countries = useCountries()
  const tagOpen = useOpen<string[]>()
  const noteOpen = useOpen<string>()
  const taxOpen = useOpen<CustomerFreeTax>()
  const customerOpen = useOpen<CustomerInfoRes>()
  const addressOpen = useOpen<AddressType>()
  const storeCountry = useManageState(state => state.shopInfo?.country)
  const [openMore, setOpenMore] = useState(-1)

  useEffect(() => {
    if (!id) return
    info.run({ id })
  }, [id])

  const name = [info?.data?.first_name, info?.data?.last_name].filter(Boolean).join(' ')

  const onUpdateAddress = async (data: UpdateAddressReq) => {
    await updateAddress.runAsync(data)
    info.run({ id })
    sMessage.success(t('设置成功'))
  }

  const onRemoveAddress = async (address_id: number) => {
    await removeAddress.runAsync({ address_id })
    info.run({ id })
    sMessage.success(t('地址删除成功'))
  }

  return (
    <Page
      back={'/customers/customers'}
      title={name}
      loadingHiddenBg={!info.data}
      loading={!info.data || !countries.data || info.loading}
      width={950}
    >
      <Flex className={'fit-width'} gap={16}>
        <Flex vertical className={'flex1'} gap={16}>
          <SCard
            extra={
              <Button type={'link'} size={'small'}>
                {t('加入黑名单')}
              </Button>
            }
            title={
              <Flex align={'center'} gap={12}>
                {name}
                <Status>{t('未注册')}</Status>
              </Flex>
            }
            className={'fit-width'}
          >
            <div>{t('尚未登录过')}</div>
            <div style={{ marginTop: 8 }}>{t('2024-11-19 18:41来自:手动创建')}</div>
          </SCard>

          <SCard title={t('订单数据')} className={'fit-width'}>
            <Flex style={{ marginTop: 8 }}>
              <Flex align={'center'} vertical gap={4} className={'flex1'}>
                <div>{2} 天前</div>
                <div className={'secondary'}>{t('最近一笔订单')}</div>
              </Flex>
              <div className={styles.line} />
              <Flex align={'center'} vertical gap={4} className={'flex1'}>
                <div>12</div>
                <div className={'secondary'}>{t('总订单数')}</div>
              </Flex>
              <div className={styles.line} />
              <Flex align={'center'} vertical gap={4} className={'flex1'}>
                <div>US$ 0.58</div>
                <div className={'secondary'}>{t('总消费金额')}</div>
              </Flex>
              <div className={styles.line} />
              <Flex align={'center'} vertical gap={4} className={'flex1'}>
                <div>US$ 0.29</div>
                <div className={'secondary'}>{t('客单价')}</div>
              </Flex>
            </Flex>
          </SCard>

          <SCard title={t('最近5笔订单')} className={'fit-width'}>
            asd
          </SCard>
        </Flex>
        <Flex vertical gap={16} style={{ width: 320 }}>
          <SCard
            extra={
              <Button
                onClick={() => { customerOpen.edit(info?.data) }}
                type={'link'}
                size={'small'}
              >
                {t('编辑')}
              </Button>
            }
            title={t('客户信息')}
            className={'fit-width'}
          >
            <CustomerBaseInfo info={info?.data} />

            <Flex className={styles.item} align={'center'} justify={'space-between'}>
              <div className={styles.title}>{t('收货地址')}</div>
              <Button
                onClick={() => {
                  addressOpen.edit()
                }} type={'link'} size={'small'}
              >
                {t('添加收货地址')}
              </Button>
            </Flex>

            <SRender style={{ color: '#aaa' }} render={!info?.data?.address?.length}>
              --
            </SRender>

            <ShowMore<AddressType>
              maxCount={3}
              items={info?.data?.address || []}
            >
              {
                (address, index) => (
                  <div
                    style={{
                      borderColor: 'var(--color-border)',
                      padding: 12,
                      margin: 0,
                      marginBottom: 12
                    }}
                    className={styles.freeTaxItem} key={address.id}
                  >
                    {formatAddress(
                      address,
                      address.id === info?.data?.default_address_id ? <Status>{t('默认')}</Status> : ''
                    )}
                    <Flex align={'center'} gap={8} justify={'flex-end'}>
                      <Button onClick={() => { addressOpen.edit(address) }} type={'link'} size={'small'}>
                        {t('编辑')}
                      </Button>
                      <Popover
                        open={openMore === address.id}
                        onOpenChange={(open) => { setOpenMore(!open ? 0 : address.id) }}
                        overlayInnerStyle={{ minWidth: 100, padding: 4 }}
                        placement={'bottom'}
                        trigger={'click'}
                        arrow={false}
                        content={
                          <Flex onClick={() => { setOpenMore(0) }} vertical>
                            <Button
                              onClick={async () => { await onUpdateAddress({ customer_id: id, is_default: true, address }) }}
                              type={'text'}
                            >
                              <Flex justify={'flex-start'} flex={1}>
                                {t('设为默认地址')}
                              </Flex>
                            </Button>
                            <Button
                              onClick={async () => { await onRemoveAddress(address.id) }}
                              style={{ fontWeight: 550 }}
                              type={'text'}
                              danger
                            >
                              <Flex justify={'flex-start'} flex={1}>{t('删除地址')}</Flex>
                            </Button>
                          </Flex>
                        }
                      >
                        <IconButton
                          loading={
                            (
                              updateAddress.loading ? updateAddress.params?.[0]?.address?.id === address.id : false
                            ) ||
                            (
                              removeAddress.loading ? removeAddress.params?.[0]?.address_id === address.id : false
                            )
                        }
                          style={{ backgroundColor: openMore === address.id ? '#cccccc' : undefined }}
                          type={'text'}
                          size={22}
                        >
                          <IconDots size={14} />
                        </IconButton>
                      </Popover>
                    </Flex>
                  </div>
                )
              }
            </ShowMore>

            <Flex className={styles.item} align={'center'} justify={'space-between'}>
              <div className={styles.title}>{t('订阅')}</div>
              <SRender render={info?.data?.email || info?.data?.phone?.num}>
                <Button style={{ marginRight: -8 }} type={'link'} size={'small'}>
                  {t('编辑')}
                </Button>
              </SRender>
            </Flex>
            <Flex align={'center'} gap={12}>
              {t('邮件')}
              <Status>{info?.data?.email ? t('未订阅') : t('未设置邮箱')}</Status>
            </Flex>
            <Flex align={'center'} style={{ marginTop: 12 }} gap={12}>
              {t('短信')}
              <Status>{info?.data?.phone?.num ? t('未订阅') : t('未设置手机号')}</Status>
            </Flex>
          </SCard>
          <SCard
            extra={
              <Button
                onClick={() => {
                  const country = countries.data?.find(i => i.code === (info?.data?.address?.[0]?.country || storeCountry))
                  const area: TaxFeeItem = {
                    country_code: country?.code || '',
                    zones: country?.zones?.length ? [] : ['all'],
                    id: genId()
                  }
                  taxOpen.edit({
                    free: info?.data?.tax?.free || false,
                    all: info?.data?.tax?.all || false,
                    areas: info?.data?.tax?.areas?.length ? info?.data?.tax?.areas : [area]
                  })
                }}
                style={{ marginRight: -8 }}
                type={'link'}
                size={'small'}
              >
                {t('编辑')}
              </Button>
            }
            title={t('免税地区')} className={'fit-width'}
          >
            <SRender render={!info.data?.tax?.free}>
              <span style={{ color: '#aaa' }}>--</span>
            </SRender>
            <SRender render={info.data?.tax?.free ? info?.data?.tax?.all : null}>
              {t('对所有地区免税')}
            </SRender>
            <SRender render={info.data?.tax?.free && !info?.data?.tax?.all ? info?.data?.tax?.areas?.length : null}>
              {
                info?.data?.tax?.areas?.map(area => (
                  <Flex className={styles.freeTaxItem} align={'center'} gap={4} key={area.id}>
                    <div>{countries?.data?.find(i => area.country_code === i.code)?.name}</div>
                    <div style={{ fontWeight: 'bolder' }}>·</div>
                    <div className={'secondary'}>
                      {area.zones?.includes('all') ? t('全部区域') : t('x个区域', { x: area.zones.length })}
                    </div>
                  </Flex>
                ))
              }
            </SRender>
          </SCard>
          <SCard
            extra={
              <Button
                onClick={() => { tagOpen.edit(info?.data?.tags) }}
                style={{ marginRight: -8 }}
                type={'link'}
                size={'small'}
              >
                {t('编辑')}
              </Button>
            }
            title={t('标签')}
            className={'fit-width'}
          >
            <Flex wrap={'wrap'} gap={8}>
              {info.data?.tags?.map((tag) => (<Status key={tag}>{tag}</Status>))}
            </Flex>
            <SRender render={!info.data?.tags?.length}>
              <span style={{ color: '#aaa' }}>--</span>
            </SRender>
          </SCard>
          <SCard
            extra={
              <Button
                onClick={() => { noteOpen.edit(info?.data?.note) }}
                style={{ marginRight: -8 }}
                type={'link'}
                size={'small'}
              >
                {t('编辑')}
              </Button>
            }
            title={t('备注')}
            className={'fit-width'}
          >
            <div style={{ wordWrap: 'break-word' }}>
              {info.data?.note}
            </div>
            <SRender render={!info.data?.note}>
              <span style={{ color: '#aaa' }}>--
              </span>
            </SRender>
          </SCard>
        </Flex>
      </Flex>

      <TagModal customerId={info?.data?.id || 0} openInfo={tagOpen} onFresh={info.refresh} />
      <NoteModal customerId={info?.data?.id || 0} openInfo={noteOpen} onFresh={info.refresh} />
      <TaxModal customerId={info?.data?.id || 0} openInfo={taxOpen} onFresh={info.refresh} />
      <CustomerModal openInfo={customerOpen} onFresh={info.refresh} />
      <AddressModal openInfo={addressOpen} customerId={info?.data?.id || 0} onFresh={info.refresh} />
    </Page>
  )
}
