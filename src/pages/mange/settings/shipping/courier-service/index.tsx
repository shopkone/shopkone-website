import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconArrowRight, IconChevronRight, IconMapPin, IconTruckDelivery, IconWorld } from '@tabler/icons-react'
import { Button, Empty, Flex } from 'antd'

import SCard from '@/components/s-card'
import SLocation from '@/components/s-location'
import { useShippingState } from '@/pages/mange/settings/shipping/state'

import styles from './index.module.less'

export default function CourierService () {
  const nav = useNavigate()
  const defaultLocation = useShippingState().locations?.find(item => item.default)
  const { t } = useTranslation('settings', { keyPrefix: 'shipping' })

  return (
    <Flex vertical gap={16}>
      <SCard
        tips={t('当订单无法通过发货点路由寻找到库存满足发货地点时，将默认分配至该地点。')}
        extra={(
          <Button size={'small'} type={'link'}>{t('更改默认地点')}</Button>
        )}
        title={t('默认地点')}
      >
        <SLocation hideTag value={defaultLocation ? [defaultLocation] : []} />
      </SCard>

      <SCard
        extra={<Button size={'small'} type={'link'}>{t('编辑')}</Button>}
        title={t('发货点路由')}
        tips={t('当新订单产生时，将根据此路由规则，自动为订单分配库存满足发货地点。')}
      >
        <SLocation hideTag value={defaultLocation ? [defaultLocation] : []} />
      </SCard>

      <SCard
        extra={
          <Button onClick={() => { nav('courier-service/change') }} size={'small'} type={'link'}>
            {t('创建自定义方案')}
          </Button>
        }
        title={t('运费方案')}
        tips={t('设置店铺可配送的区域，以及顾客在结算时可选择的运费方案。')}
      >
        <div className={styles.table}>
          <div className={styles.title}>{t('通用物流方案')}</div>
          <Flex vertical>
            <Flex align={'center'} className={styles.item}>
              <div className={styles.left}>
                <div className={styles.name}>{t('通用方案')}</div>
                <div>{t('x商品', { count: 0 })}</div>
              </div>
              <div className={styles.right}>
                <div className={styles.name}>{t('适用范围')}</div>
                <Flex align={'center'}>
                  <div><IconMapPin size={16} style={{ position: 'relative', top: 2, marginRight: 4 }} /></div>
                  <div>{t('x发货地点', { count: 2 })}</div>
                  <div style={{ position: 'relative', top: 3, marginLeft: 12, marginRight: 12 }}><IconArrowRight size={15} /></div>
                  <div style={{ position: 'relative', top: 2, marginRight: 4 }}><IconWorld size={16} /></div>
                  <div>{t('x送达区域', { count: 2 })}</div>
                </Flex>
              </div>
              <div className={styles['right-icon']}>
                <IconChevronRight size={16} />
              </div>
            </Flex>
          </Flex>
        </div>

        <div style={{ marginTop: 16 }} className={styles.table}>
          <div className={styles.title}>
            {t('自定义方案')}
          </div>
          <Empty
            image={
              <div style={{ paddingTop: 32 }}>
                <IconTruckDelivery size={64} color={'#ddd'} />
              </div>
            }
            description={(
              <div className={'secondary'}>
                {t('创建一组新的自定义物流方案，您可以为该物流方案设置指定运输区域下的运费')}
              </div>
            )}
            style={{ paddingBottom: 24 }}
          >
            <Flex justify={'center'}>
              <Button onClick={() => { nav('/settings/shipping/courier-service/change') }} type={'primary'}>
                {t('创建自定义方案')}
              </Button>
            </Flex>
          </Empty>
        </div>
      </SCard>
    </Flex>
  )
}
