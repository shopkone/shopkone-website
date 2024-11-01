import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconArrowRight, IconChevronRight, IconMapPin, IconTruckDelivery, IconWorld } from '@tabler/icons-react'
import { useRequest } from 'ahooks'
import { Button, Empty, Flex } from 'antd'

import { LocationListApi } from '@/api/location/list'
import { ShippingType } from '@/api/shipping/base'
import { ShippingListApi } from '@/api/shipping/list'
import SCard from '@/components/s-card'
import SLocation from '@/components/s-location'
import SRender from '@/components/s-render'
import Status from '@/components/status'
import { useOpen } from '@/hooks/useOpen'
import DefaultChanger from '@/pages/mange/settings/shipping/courier-service/default-changer'
import OrderChanger from '@/pages/mange/settings/shipping/courier-service/order-changer'
import { useShippingState } from '@/pages/mange/settings/shipping/state'

import styles from './index.module.less'

export default function CourierService () {
  const nav = useNavigate()
  const fetchLocations = useRequest(async () => await LocationListApi({ active: true }), { manual: true })
  const locations = useShippingState().locations
  const setLocations = useShippingState(state => state.setLocations)
  const defaultLocation = locations?.find(item => item.default)
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })
  const list = useRequest(ShippingListApi)
  const setLoading = useShippingState(state => state.setLoading)
  const openInfo = useOpen<number>()
  const orderOpenInfo = useOpen()

  const customerList = list.data?.filter(item => item.type === ShippingType.CustomerExpressDelivery)
  const generalList = list.data?.filter(item => item.type === ShippingType.GeneralExpressDelivery)

  useEffect(() => {
    setLoading(list.loading || fetchLocations.loading)
  }, [list.loading, fetchLocations.loading])

  useEffect(() => {
    if (!fetchLocations.data) return
    setLocations(fetchLocations.data)
  }, [fetchLocations.data])

  return (
    <Flex vertical gap={16}>
      <SCard
        tips={t('当订单无法通过发货点路由寻找到库存满足发货地点时，将默认分配至该地点。')}
        extra={(
          <Button
            onClick={() => { openInfo.edit(defaultLocation?.id) }}
            size={'small'}
            type={'link'}
          >
            {t('更改默认地点')}
          </Button>
        )}
        title={t('默认地点')}
      >
        <SLocation
          hideLoading
          hideTag
          value={defaultLocation ? [defaultLocation] : []}
        />
      </SCard>

      <SCard
        extra={
          <Button
            onClick={() => { orderOpenInfo.edit() }}
            size={'small'}
            type={'link'}
          >
            {t('编辑')}
          </Button>
      }
        title={t('发货点路由')}
        tips={t('当新订单产生时，将根据此路由规则，自动为订单分配库存满足发货地点。')}
      >
        <Flex gap={8} wrap={'wrap'}>
          {t('当前顺序：')}
          {
            locations?.map((item, index) => (
              <Flex key={item.id} align={'center'} wrap={'wrap'}>
                <SRender render={index}>
                  <IconChevronRight style={{ marginRight: 9 }} size={15} />
                </SRender>
                <Status>{item.name}</Status>
              </Flex>
            ))
          }
        </Flex>
      </SCard>

      <SCard
        title={t('运费方案')}
        tips={t('设置店铺可配送的区域，以及顾客在结算时可选择的运费方案。')}
        style={{ display: list?.loading ? 'none' : undefined }}
      >
        <div className={styles.table}>
          <div className={styles.title}>{t('通用运费方案')}</div>
          <SRender render={!generalList?.length}>
            <Empty
              image={
                <div style={{ paddingTop: 32 }}>
                  <IconTruckDelivery size={64} color={'#ddd'} />
                </div>
              }
              description={(
                <div className={'secondary'}>
                  {t('添加运费以便客户完成结账')}
                </div>
              )}
              style={{ paddingBottom: 24 }}
            >
              <Flex justify={'center'}>
                <Button onClick={() => { nav(`courier-service/change?type=${ShippingType.GeneralExpressDelivery}`) }} type={'primary'}>
                  {t('添加通用运费方案')}
                </Button>
              </Flex>
            </Empty>
          </SRender>
          <SRender render={generalList?.length}>
            {
              generalList?.map(item => (
                <Flex onClick={() => { nav(`courier-service/change/${item.id}?type=${item.type}`) }} vertical key={item.id}>
                  <Flex align={'center'} className={styles.item}>
                    <div className={styles.left}>
                      <div className={styles.name}>{t('通用方案')}</div>
                      <div>{t('全部商品')}</div>
                    </div>
                    <div className={styles.right}>
                      <div className={styles.name}>{t('适用范围')}</div>
                      <Flex align={'center'}>
                        <div><IconMapPin size={16} style={{ position: 'relative', top: 2, marginRight: 4 }} /></div>
                        <div>{t('x发货地点', { x: locations?.length || 0 })}</div>
                        <div style={{ position: 'relative', top: 3, marginLeft: 12, marginRight: 12 }}><IconArrowRight size={15} /></div>
                        <div style={{ position: 'relative', top: 2, marginRight: 4 }}><IconWorld size={16} /></div>
                        <div>{t('x送达地区', { x: item.zone_count })}</div>
                      </Flex>
                    </div>
                    <div className={styles['right-icon']}>
                      <IconChevronRight size={16} />
                    </div>
                  </Flex>
                </Flex>
              ))
            }
          </SRender>
        </div>

        <div style={{ marginTop: 16 }} className={styles.table}>
          <Flex align={'center'} justify={'space-between'} className={styles.title}>
            {t('自定义运费方案')}
            <SRender render={customerList?.length}>
              <Button onClick={() => { nav(`courier-service/change?type=${ShippingType.CustomerExpressDelivery}`) }} size={'small'} type={'link'}>
                {t('添加自定义运费方案')}
              </Button>
            </SRender>
          </Flex>
          <SRender render={!customerList?.length}>
            <Empty
              image={
                <div style={{ paddingTop: 32 }}>
                  <IconTruckDelivery size={64} color={'#ddd'} />
                </div>
              }
              description={(
                <div className={'secondary'}>
                  {t('单独为商品设置不同的运费')}
                </div>
              )}
              style={{ paddingBottom: 24 }}
            >
              <Flex justify={'center'}>
                <Button onClick={() => { nav(`courier-service/change?type=${ShippingType.CustomerExpressDelivery}`) }} >
                  {t('添加自定义运费方案')}
                </Button>
              </Flex>
            </Empty>
          </SRender>

          <SRender render={customerList?.length}>
            {
              customerList?.map(item => (
                <Flex className={styles.itemWrap} onClick={() => { nav(`courier-service/change/${item.id}?type=${item.type}`) }} vertical key={item.id}>
                  <Flex align={'center'} className={styles.item}>
                    <div className={styles.left}>
                      <div className={styles.name}>{item.name}</div>
                      <div>{t('x商品', { x: item.product_count })}</div>
                    </div>
                    <div className={styles.right}>
                      <div className={styles.name}>{t('适用范围')}</div>
                      <Flex align={'center'}>
                        <div><IconMapPin size={16} style={{ position: 'relative', top: 2, marginRight: 4 }} /></div>
                        <div>{t('x发货地点', { x: item.location_count })}</div>
                        <div style={{ position: 'relative', top: 3, marginLeft: 12, marginRight: 12 }}><IconArrowRight size={15} /></div>
                        <div style={{ position: 'relative', top: 2, marginRight: 4 }}><IconWorld size={16} /></div>
                        <div>{t('x送达地区', { x: item.zone_count })}</div>
                      </Flex>
                    </div>
                    <div className={styles['right-icon']}>
                      <IconChevronRight size={16} />
                    </div>
                  </Flex>
                </Flex>
              ))
            }
          </SRender>
        </div>

        <DefaultChanger onFresh={fetchLocations.refresh} openInfo={openInfo} locations={locations} />

        <OrderChanger locations={locations} openInfo={orderOpenInfo} onFresh={fetchLocations.refresh} />
      </SCard>
    </Flex>
  )
}
