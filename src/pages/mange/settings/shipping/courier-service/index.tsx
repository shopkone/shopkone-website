import { useNavigate } from 'react-router-dom'
import { IconArrowRight, IconChevronRight, IconMapPin, IconTruckDelivery, IconWorld } from '@tabler/icons-react'
import { Button, Empty, Flex } from 'antd'

import SCard from '@/components/s-card'
import SLocation from '@/components/s-location'
import { useI18n } from '@/hooks/use-lang'
import { useShippingState } from '@/pages/mange/settings/shipping/state'

import styles from './index.module.less'

export default function CourierService () {
  const nav = useNavigate()
  const defaultLocation = useShippingState().locations?.find(item => item.default)
  const t = useI18n()

  return (
    <Flex vertical gap={16}>
      <SCard
        tips={t('当订单无法通过运输点路由以查找满足运输位置的库存时，将默认分配到该位置。')}
        extra={(
          <Button size={'small'} type={'text'}>{t('更改默认位置')}</Button>
        )}
        title={t('默认位置')}
      >
        <SLocation hideTag value={defaultLocation ? [defaultLocation] : []} />
      </SCard>

      <SCard
        extra={<Button size={'small'} type={'text'}>{t('设置')}</Button>}
        title={t('运输点路由')}
        tips={t('当生成新订单时，将根据此路由规则，库存将自动分配给订单以满足运输位置。')}
      >
        <SLocation hideTag value={defaultLocation ? [defaultLocation] : []} />
      </SCard>

      <SCard
        extra={
          <Button onClick={() => { nav('courier-service/change') }} size={'small'} type={'link'}>
            {t('新档案')}
          </Button>
        }
        title={t('运输')}
        tips={t('选择您发货的地点以及在结账时收取的运费。')}
      >
        <div className={styles.table}>
          <div className={styles.title}>{t('一般运输费率')}</div>
          <Flex vertical>
            <Flex align={'center'} className={styles.item}>
              <div className={styles.left}>
                <div className={styles.name}>{t('一般')}</div>
                <div>0 {t('产品')}</div>
              </div>
              <div className={styles.right}>
                <div className={styles.name}>{t('费率为')}</div>
                <Flex align={'center'}>
                  <div><IconMapPin size={16} style={{ position: 'relative', top: 2, marginRight: 4 }} /></div>
                  <div>2 {t('地点')}</div>
                  <div style={{ position: 'relative', top: 3, marginLeft: 12, marginRight: 12 }}><IconArrowRight size={15} /></div>
                  <div style={{ position: 'relative', top: 2, marginRight: 4 }}><IconWorld size={16} /></div>
                  <div>2 {t('区域')}</div>
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
            {t('自定义运输费率')}
          </div>
          <Empty
            image={
              <div style={{ paddingTop: 32 }}>
                <IconTruckDelivery size={64} color={'#ddd'} />
              </div>
            }
            description={(
              <div className={'secondary'}>
                {t('创建一个新档案以添加自定义费率或产品组的目的地限制。')}
              </div>
            )}
            style={{ paddingBottom: 24 }}
          >
            <Button onClick={() => { nav('/settings/shipping/courier-service/change') }} type={'primary'}>
              {t('新档案')}
            </Button>
          </Empty>
        </div>
      </SCard>
    </Flex>
  )
}
