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

  return (
    <Flex vertical gap={16}>
      <SCard
        tips={'When the order cannot be routed through the shipping point to find the inventory that meets the shipping location, it will be assigned to that location by default.'}
        extra={(
          <Button size={'small'} type={'text'}>Change default location</Button>
        )}
        title={'Default location'}
      >
        <SLocation hideTag value={defaultLocation ? [defaultLocation] : []} />
      </SCard>

      <SCard
        extra={<Button size={'small'} type={'text'}>Set up</Button>}
        title={'Shipping point routing'}
        tips={'When a new order is generated, according to this routing rule, the inventory will be automatically assigned to the order to meet the shipping location.'}
      >
        <SLocation hideTag value={defaultLocation ? [defaultLocation] : []} />
      </SCard>

      <SCard
        extra={
          <Button onClick={() => { nav('courier-service/change') }} size={'small'} type={'link'}>
            New profile
          </Button>
        }
        title={'Shipping'}
        tips={'Choose where you ship and how much you charge for shipping at checkout.'}
      >
        <div className={styles.table}>
          <div className={styles.title}>General shipping rates</div>
          <Flex vertical>
            <Flex align={'center'} className={styles.item}>
              <div className={styles.left}>
                <div className={styles.name}>General</div>
                <div>0 products</div>
              </div>
              <div className={styles.right}>
                <div className={styles.name}>Rates for</div>
                <Flex align={'center'}>
                  <div><IconMapPin size={16} style={{ position: 'relative', top: 2, marginRight: 4 }} /></div>
                  <div>2 locations</div>
                  <div style={{ position: 'relative', top: 3, marginLeft: 12, marginRight: 12 }}><IconArrowRight size={15} /></div>
                  <div style={{ position: 'relative', top: 2, marginRight: 4 }}><IconWorld size={16} /></div>
                  <div>2 zones</div>
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
            Custom shipping rates
          </div>
          <Empty
            image={
              <div style={{ paddingTop: 32 }}>
                <IconTruckDelivery size={64} color={'#ddd'} />
              </div>
            }
            description={(
              <div className={'secondary'}>
                Create a new profile to add custom rates or destination restrictions for groups of products.
              </div>
            )}
            style={{ paddingBottom: 24 }}
          >
            <Button onClick={() => { nav('/settings/shipping/courier-service/change') }} type={'primary'}>
              New profile
            </Button>
          </Empty>
        </div>
      </SCard>
    </Flex>
  )
}
